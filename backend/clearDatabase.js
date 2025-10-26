const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const Complaint = require('./models/Complaint');
const FeedbackPoll = require('./models/FeedbackPoll');

async function clearDatabase() {
  try {
    await mongoose.connect(process.env.MONGO_URL, { dbName: "CampusVoice" });
    console.log('Connected to MongoDB');

    const usersDeleted = await User.deleteMany({});
    console.log(`Deleted ${usersDeleted.deletedCount} users`);

    const complaintsDeleted = await Complaint.deleteMany({});
    console.log(`Deleted ${complaintsDeleted.deletedCount} complaints`);

    const pollsDeleted = await FeedbackPoll.deleteMany({});
    console.log(`Deleted ${pollsDeleted.deletedCount} feedback polls`);

    console.log('\nDatabase cleared successfully!');

    await mongoose.connection.close();
    console.log('Database connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error clearing database:', error);
    process.exit(1);
  }
}

clearDatabase();
