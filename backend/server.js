// Import required modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB Atlas');
    seedAdminAccount(); // Create default admin account
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  });

// Function to seed management account on server start
async function seedAdminAccount() {
  try {
    const User = require('./models/User');
    const existingAdmin = await User.findOne({ email: 'management@rcee.ac.in' });
    
    if (!existingAdmin) {
      const admin = new User({
        email: 'management@rcee.ac.in',
        password: '1234',
        role: 'admin',
        name: 'Management',
        department: 'Management'
      });
      await admin.save();
      console.log('✅ Default management account created: management@rcee.ac.in / 1234');
    } else {
      console.log('✅ Management account already exists');
    }
  } catch (error) {
    console.error('❌ Error seeding management account:', error);
  }
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Campus Complaint System API is running!' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
