const mongoose = require("mongoose");

// Party Schema
const PartySchema = new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    head: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }
  });
  
  // Ensure head user is included in users array
  PartySchema.pre("save", function (next) {
    const party = this;
    if (!party.users.includes(party.head)) {
      return next(new Error("Head user must be part of the users array."));
    }
    next();
  });

const Party = mongoose.model("Party", PartySchema);

module.exports = Party;