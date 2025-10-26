// Authentication Routes - Register and Login
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { rollNumber, name, department, year, section, password } = req.body;
    
    // Validation
    if (!rollNumber || !name || !department || !year || !section || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Check if student already exists
    const existingStudent = await User.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student with this roll number already exists' });
    }
    
    // Create new student (NO ENCRYPTION - plain password as requested)
    const student = new User({
      rollNumber,
      name,
      department,
      year,
      section,
      password, // Plain password stored as-is
      role: 'student'
    });
    
    await student.save();
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: student._id, 
        role: student.role,
        rollNumber: student.rollNumber 
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: student._id,
        rollNumber: student.rollNumber,
        name: student.name,
        department: student.department,
        year: student.year,
        section: student.section,
        role: student.role
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user (student or admin)
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { identifier, password, userType } = req.body;
    
    // Validation
    if (!identifier || !password || !userType) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    let user;
    
    // Student login (using roll number)
    if (userType === 'student') {
      user = await User.findOne({ rollNumber: identifier.toUpperCase(), role: 'student' });
    } 
    // Admin login (using email)
    else if (userType === 'admin') {
      user = await User.findOne({ email: identifier.toLowerCase(), role: 'admin' });
    }
    
    // Check if user exists
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password (plain text comparison - NO ENCRYPTION)
    if (user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        role: user.role,
        rollNumber: user.rollNumber,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        department: user.department,
        role: user.role,
        ...(user.role === 'student' ? { 
          rollNumber: user.rollNumber,
          year: user.year,
          section: user.section 
        } : { 
          email: user.email 
        })
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});

module.exports = router;
