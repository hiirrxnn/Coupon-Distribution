// server/config/db.js
const mongoose = require('mongoose');
const config = require('config');
const db = config.get('mongoURI');

// Add this at the top, after require statements

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', true);
    await mongoose.connect(db);
    console.log('MongoDB Connected...');

  } catch (err) {
    console.error(err.message);
    // Exit process with failure
    process.exit(1);
  }
};

module.exports = connectDB;