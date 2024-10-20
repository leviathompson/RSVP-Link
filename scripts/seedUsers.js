const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const connectDB = require('../config/db');
require('dotenv').config();

connectDB();

const users = [
  {
    "name": "Levi Thompson",
    "contactMethods": {
      "emails": [
        {
          "address": "levithompson17@gmail.com"
        }
      ],
      "phones": [
        {
          "number": "3062316451"
        }
      ]
    },
  }, 
  {
    "name": "Sky Stinson",
    "contactMethods": {
      "phones": [
        {
          "number": "3062621486"
        },
        {
          "number": "3067347377"
        }
      ]
    },
  }
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

