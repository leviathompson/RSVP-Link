const mongoose = require('mongoose');
const User = require("../models/userModel.js");
const Party = require("../models/partyModel.js");
const connectDB = require('../config/db');
require('dotenv').config();

connectDB();

const seedParties = async () => {
  try {
    // Fetch users by name to get their IDs
    const levi = await User.findOne({ name: "Levi Thompson" });
    const sky = await User.findOne({ name: "Sky Stinson" });
    const marta = await User.findOne({ name: "Marta Krueger" });
    const eli = await User.findOne({ name: "Eli Harper" });

    const parties = [
      {
        name: "Weekend Warriors",
        users: [levi._id, sky._id],
        head: levi._id,
      },
      {
        name: "Creative Collective",
        users: [marta._id, eli._id],
        head: marta._id,
      },
      {
        name: "Adventure Squad",
        users: [levi._id, eli._id, sky._id],
        head: sky._id,
      }
    ];

    await Party.deleteMany();
    const createdParties = await Party.create(parties);

    // Update each user's party field to reference the correct party
    await User.findByIdAndUpdate(levi._id, { party: createdParties[0]._id });
    await User.findByIdAndUpdate(sky._id, { party: createdParties[0]._id });
    await User.findByIdAndUpdate(marta._id, { party: createdParties[1]._id });
    await User.findByIdAndUpdate(eli._id, { party: createdParties[1]._id });
    await User.findByIdAndUpdate(levi._id, { party: createdParties[2]._id });
    await User.findByIdAndUpdate(sky._id, { party: createdParties[2]._id });
    await User.findByIdAndUpdate(eli._id, { party: createdParties[2]._id });

    console.log('Parties and user references seeded successfully');
    mongoose.connection.close();
  } catch (error) {
    console.error('Error seeding parties:', error);
    mongoose.connection.close();
  }
};

seedParties();
