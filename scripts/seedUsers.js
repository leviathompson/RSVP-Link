const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const connectDB = require('../config/db');
require('dotenv').config();

connectDB();

const users = [
  {
    "name": "Levi Thompson",
    "password": "securePassword123",
    "contactMethods": {
      "emails": [
        {
          "address": "levithompson17@gmail.com",
          "primary": true
        }
      ],
      "phones": [
        {
          "number": "3062316451"
        }
      ]
    }
  },
  {
    "name": "Sky Stinson",
    "password": "anotherSecurePassword456",
    "contactMethods": {
      "phones": [
        {
          "number": "3062621486"
        },
        {
          "number": "3067347377"
        }
      ]
    }
  },
  {
    "name": "Marta Krueger",
    "password": "yetAnotherSecurePassword789",
    "contactMethods": {
      "emails": [
        {
          "address": "martak@gmail.com",
          "primary": true
        }
      ],
      "phones": [
        {
          "number": "3065551234"
        }
      ]
    }
  },
  {
    "name": "Eli Harper",
    "password": "superSecurePassword101",
    "contactMethods": {
      "emails": [
        {
          "address": "eliharper@example.com",
          "primary": true
        }
      ],
      "phones": [
        {
          "number": "3069876543"
        }
      ]
    }
  }
];

const seedUsers = async () => {
  try {
    await User.deleteMany();
    await User.create(users);
    console.log('Users seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding users:', error);
    mongoose.connection.close();
  }
};

seedUsers();
