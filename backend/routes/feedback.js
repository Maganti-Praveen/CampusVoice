// Feedback Poll Routes
const express = require('express');
const router = express.Router();
const FeedbackPoll = require('../models/FeedbackPoll');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

// @route   POST /api/feedback
// @desc    Create a new feedback poll (Management only)
// @access  Private (Management only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { title, description, category } = req.body;
    
    // Validation
    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    
    // Create feedback poll
    const poll = new FeedbackPoll({
      title,
      description,
      category: category || 'General',
      createdBy: req.user.userId
    });
    
    await poll.save();
    
    res.status(201).json({
      message: 'Feedback poll created successfully',
      poll
    });
  } catch (error) {
    console.error('Create poll error:', error);
    res.status(500).json({ message: 'Server error while creating poll' });
  }
});

// @route   GET /api/feedback
// @desc    Get all active feedback polls
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const polls = await FeedbackPoll.find({ isActive: true })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    // Add user's rating if they've already rated
    const pollsWithUserRating = polls.map(poll => {
      const userRating = poll.ratings.find(
        r => r.userId.toString() === req.user.userId
      );
      
      return {
        ...poll.toJSON(),
        userRating: userRating ? userRating.rating : null,
        totalRatings: poll.ratings.length
      };
    });
    
    res.json(pollsWithUserRating);
  } catch (error) {
    console.error('Get polls error:', error);
    res.status(500).json({ message: 'Server error while fetching polls' });
  }
});

// @route   GET /api/feedback/:id
// @desc    Get detailed results of a specific poll
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const poll = await FeedbackPoll.findById(req.params.id)
      .populate('createdBy', 'name email');
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    // Calculate rating distribution
    const distribution = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0
    };
    
    poll.ratings.forEach(rating => {
      distribution[rating.rating]++;
    });
    
    res.json({
      ...poll.toJSON(),
      distribution,
      totalRatings: poll.ratings.length
    });
  } catch (error) {
    console.error('Get poll details error:', error);
    res.status(500).json({ message: 'Server error while fetching poll details' });
  }
});

// @route   POST /api/feedback/:id/rate
// @desc    Submit a rating for a poll (Students only)
// @access  Private
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }
    
    // Only students can rate
    if (req.user.role !== 'student') {
      return res.status(403).json({ message: 'Only students can submit ratings' });
    }
    
    const poll = await FeedbackPoll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    if (!poll.isActive) {
      return res.status(400).json({ message: 'This poll is no longer active' });
    }
    
    // Check if user has already rated
    const existingRatingIndex = poll.ratings.findIndex(
      r => r.userId.toString() === req.user.userId
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      poll.ratings[existingRatingIndex].rating = rating;
      poll.ratings[existingRatingIndex].comment = comment || '';
    } else {
      // Add new rating
      poll.ratings.push({
        userId: req.user.userId,
        rating,
        comment: comment || ''
      });
    }
    
    await poll.save();
    
    res.json({
      message: 'Rating submitted successfully',
      averageRating: poll.averageRating,
      totalRatings: poll.ratings.length
    });
  } catch (error) {
    console.error('Rate poll error:', error);
    res.status(500).json({ message: 'Server error while submitting rating' });
  }
});

// @route   PUT /api/feedback/:id/toggle
// @desc    Toggle poll active status (Management only)
// @access  Private (Management only)
router.put('/:id/toggle', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const poll = await FeedbackPoll.findById(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    poll.isActive = !poll.isActive;
    await poll.save();
    
    res.json({
      message: `Poll ${poll.isActive ? 'activated' : 'deactivated'} successfully`,
      poll
    });
  } catch (error) {
    console.error('Toggle poll error:', error);
    res.status(500).json({ message: 'Server error while toggling poll status' });
  }
});

// @route   DELETE /api/feedback/:id
// @desc    Delete a feedback poll (Management only)
// @access  Private (Management only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const poll = await FeedbackPoll.findByIdAndDelete(req.params.id);
    
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }
    
    res.json({ message: 'Poll deleted successfully' });
  } catch (error) {
    console.error('Delete poll error:', error);
    res.status(500).json({ message: 'Server error while deleting poll' });
  }
});

module.exports = router;
