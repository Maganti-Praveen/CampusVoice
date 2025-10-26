// Script to clear all data from MongoDB database
const mongoose = require('mongoose');
require('dotenv').config();

// Import models
const User = require('./models/User');
const Complaint = require('./models/Complaint');
const FeedbackPoll = require('./models/FeedbackPoll');

async function clearDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL, { dbName: "CampusVoice" });
    console.log('✅ Connected to MongoDB');

    // Delete all users
    const usersDeleted = await User.deleteMany({});
    console.log(`🗑️  Deleted ${usersDeleted.deletedCount} users`);

    // Delete all complaints
    const complaintsDeleted = await Complaint.deleteMany({});
    console.log(`🗑️  Deleted ${complaintsDeleted.deletedCount} complaints`);

    // Delete all feedback polls
    const pollsDeleted = await FeedbackPoll.deleteMany({});
    console.log(`🗑️  Deleted ${pollsDeleted.deletedCount} feedback polls`);

    console.log('\n✅ Database cleared successfully!');
    console.log('🔄 You can now restart the server to create a fresh management account.');

    // Close connection
    await mongoose.connection.close();
    console.log('📪 Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

// Run the script
clearDatabase();
