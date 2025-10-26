const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const complaintRoutes = require('./routes/complaints');
const feedbackRoutes = require('./routes/feedback');

const app = express();

app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGO_URL, { dbName: "CampusVoice" })
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    seedAdminAccount(); 
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });

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
      console.log('Default management account created: management@rcee.ac.in / 1234');
    } else {
      console.log('Management account already exists');
    }
  } catch (error) {
    console.error('Error seeding management account:', error);
  }
}

app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/feedback', feedbackRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'Campus Complaint System API is running!' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
