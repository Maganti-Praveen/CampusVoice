// Complaint Routes - CRUD and Interactions
const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   POST /api/complaints
// @desc    Create a new complaint (Student only)
// @access  Private
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validation
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    // Only students can create complaints
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can post complaints' });
    }
    
    // Create complaint
    const complaint = new Complaint({
      title,
      description,
      category,
      studentId: req.user.userId
    });
    
    await complaint.save();
    
    res.status(201).json({
      message: 'Complaint posted successfully',
      complaint
    });
  } catch (error) {
    console.error('Create complaint error:', error);
    res.status(500).json({ message: 'Server error while creating complaint' });
  }
});

// @route   GET /api/complaints
// @desc    Get all complaints (public feed - always anonymous, no identity shown)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });
    
    // Always hide student identity for everyone (students and management)
    const anonymousComplaints = complaints.map(complaint => ({
      _id: complaint._id,
      title: complaint.title,
      description: complaint.description,
      category: complaint.category,
      status: complaint.status,
      adminResponse: complaint.adminResponse,
      agrees: complaint.agrees,
      disagrees: complaint.disagrees,
      comments: complaint.comments,
      createdAt: complaint.createdAt,
      updatedAt: complaint.updatedAt,
      // Only indicate if it's the logged-in student's complaint (for students only)
      isMyComplaint: req.user.role === 'student' && complaint.studentId.toString() === req.user.userId
    }));
    
    return res.json(anonymousComplaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
});

// @route   GET /api/complaints/my
// @desc    Get complaints posted by logged-in student
// @access  Private (Student only)
router.get('/my', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'This endpoint is for students only' });
    }
    
    const myComplaints = await Complaint.find({ studentId: req.user.userId })
      .sort({ createdAt: -1 });
    
    res.json(myComplaints);
  } catch (error) {
    console.error('Get my complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching your complaints' });
  }
});

// @route   PUT /api/complaints/:id/status
// @desc    Update complaint status and add management response (Management only)
// @access  Private (Management only)
router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Update status and response
    if (status) complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
    
    await complaint.save();
    
    // Return without student identity
    res.json({
      message: 'Complaint updated successfully',
      complaint: {
        _id: complaint._id,
        title: complaint.title,
        description: complaint.description,
        category: complaint.category,
        status: complaint.status,
        adminResponse: complaint.adminResponse,
        agrees: complaint.agrees,
        disagrees: complaint.disagrees,
        comments: complaint.comments,
        createdAt: complaint.createdAt,
        updatedAt: complaint.updatedAt
      }
    });
  } catch (error) {
    console.error('Update complaint error:', error);
    res.status(500).json({ message: 'Server error while updating complaint' });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint (Management only)
// @access  Private (Management only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error while deleting complaint' });
  }
});

// @route   POST /api/complaints/:id/agree
// @desc    Agree with a complaint
// @access  Private
router.post('/:id/agree', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const userId = req.user.userId;
    
    // Remove from disagrees if present
    complaint.disagrees = complaint.disagrees.filter(id => id.toString() !== userId);
    
    // Add to agrees if not already present
    if (!complaint.agrees.includes(userId)) {
      complaint.agrees.push(userId);
    }
    
    await complaint.save();
    
    res.json({
      message: 'Agreement recorded',
      agrees: complaint.agrees.length,
      disagrees: complaint.disagrees.length
    });
  } catch (error) {
    console.error('Agree error:', error);
    res.status(500).json({ message: 'Server error while recording agreement' });
  }
});

// @route   POST /api/complaints/:id/disagree
// @desc    Disagree with a complaint
// @access  Private
router.post('/:id/disagree', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const userId = req.user.userId;
    
    // Remove from agrees if present
    complaint.agrees = complaint.agrees.filter(id => id.toString() !== userId);
    
    // Add to disagrees if not already present
    if (!complaint.disagrees.includes(userId)) {
      complaint.disagrees.push(userId);
    }
    
    await complaint.save();
    
    res.json({
      message: 'Disagreement recorded',
      agrees: complaint.agrees.length,
      disagrees: complaint.disagrees.length
    });
  } catch (error) {
    console.error('Disagree error:', error);
    res.status(500).json({ message: 'Server error while recording disagreement' });
  }
});

// @route   POST /api/complaints/:id/comment
// @desc    Add a comment to a complaint
// @access  Private
router.post('/:id/comment', authMiddleware, async (req, res) => {
  try {
    const { text } = req.body;
    
    if (!text || text.trim() === '') {
      return res.status(400).json({ message: 'Comment text is required' });
    }
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    // Add comment (anonymous for students in public view)
    complaint.comments.push({
      userId: req.user.userId,
      text: text.trim()
    });
    
    await complaint.save();
    
    res.json({
      message: 'Comment added successfully',
      comment: complaint.comments[complaint.comments.length - 1]
    });
  } catch (error) {
    console.error('Comment error:', error);
    res.status(500).json({ message: 'Server error while adding comment' });
  }
});

module.exports = router;
