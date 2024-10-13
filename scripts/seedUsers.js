const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const connectDB = require('../config/db');
require('dotenv').config();

connectDB();

const users = [
  { name: 'Test Email', email: 'levithompson17@gmail.com' },
  { name: 'Test Phone', phone: '3062316451', carrier: '670a8ff2e9888111e0f8eb4c' }
];

User.insertMany(users)
  .then(() => {
    console.log('Users seeded successfully');
    mongoose.connection.close();
  })
  .catch((error) => {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  });

