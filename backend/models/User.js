// User Model - for both Students and Admins
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  // Common fields
  email: {
    type: String,
    sparse: true, // Allows null values for students who don't have email
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['student', 'admin'],
    default: 'student'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  
  // Student-specific fields
  rollNumber: {
    type: String,
    sparse: true, // Allows null for admin users
    uppercase: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: Number,
    min: 1,
    max: 4
  },
  section: {
    type: String,
    uppercase: true,
    trim: true
  }
}, {
  timestamps: true
});

// Index for faster queries
userSchema.index({ rollNumber: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
