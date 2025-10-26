// Complaint Model
const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  // Complaint details
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
    enum: ['Hostel', 'Mess', 'Transport', 'Academics', 'Others'],
    required: true
  },
  
  // Student who posted (identity hidden in public view)
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Status management
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'
  },
  adminResponse: {
    type: String,
    default: ''
  },
  
  // Interactions
  agrees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  disagrees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    text: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index for faster queries
complaintSchema.index({ studentId: 1 });
complaintSchema.index({ status: 1 });
complaintSchema.index({ category: 1 });

module.exports = mongoose.model('Complaint', complaintSchema);
