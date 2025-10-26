const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    sparse: true,
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
  
  rollNumber: {
    type: String,
    sparse: true,
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

userSchema.index({ rollNumber: 1 });
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
