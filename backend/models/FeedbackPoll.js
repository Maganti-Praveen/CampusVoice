// Feedback Poll Model - for teacher/course ratings
const mongoose = require('mongoose');

const feedbackPollSchema = new mongoose.Schema({
  // Poll details
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'General'
  },
  
  // Poll status
  isActive: {
    type: Boolean,
    default: true
  },
  
  // Ratings (1-5 stars)
  ratings: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      default: ''
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  // Admin who created
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Virtual field for average rating
feedbackPollSchema.virtual('averageRating').get(function() {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((acc, curr) => acc + curr.rating, 0);
  return (sum / this.ratings.length).toFixed(2);
});

// Ensure virtuals are included in JSON
feedbackPollSchema.set('toJSON', { virtuals: true });
feedbackPollSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('FeedbackPoll', feedbackPollSchema);
