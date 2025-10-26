const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }
    
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can post complaints' });
    }
    
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

router.get('/', authMiddleware, async (req, res) => {
  try {
    const complaints = await Complaint.find()
      .sort({ createdAt: -1 });
    
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
      isMyComplaint: req.user.role === 'student' && complaint.studentId.toString() === req.user.userId
    }));
    
    return res.json(anonymousComplaints);
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
});

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

router.put('/:id/status', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { status, adminResponse } = req.body;
    
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    if (status) complaint.status = status;
    if (adminResponse !== undefined) complaint.adminResponse = adminResponse;
    
    await complaint.save();
    
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

router.post('/:id/agree', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const userId = req.user.userId;
    
    complaint.disagrees = complaint.disagrees.filter(id => id.toString() !== userId);
    
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

router.post('/:id/disagree', authMiddleware, async (req, res) => {
  try {
    const complaint = await Complaint.findById(req.params.id);
    
    if (!complaint) {
      return res.status(404).json({ message: 'Complaint not found' });
    }
    
    const userId = req.user.userId;
    
    complaint.agrees = complaint.agrees.filter(id => id.toString() !== userId);
    
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
