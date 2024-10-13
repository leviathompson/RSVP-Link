const mongoose = require('mongoose');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to the DB ✅');
  } catch (error) {
    console.error('ERROR: Failed to connect to the database');
    console.error('MongoDB Connection Error:', error);
    process.exit(1); // Exit the process on failure
  }
}

module.exports = connectDB;
