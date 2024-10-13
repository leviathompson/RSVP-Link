const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");
const Schema = mongoose.Schema;

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: false,
      unique: false,
    },
    phone: {
      type: Number,
      required: false,
      unique: false,
    },
    carrier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Carrier",
      required: function () {
        return this.Phone != null; // Carrier is required only if Phone is present
      },
    },
    magicLink: {
      type: String,
      required: false,
      unique: false,
      default: uuidv4,
    },
    magicLinkExpired: {
      type: Boolean,
      default: false,
    },
  },
  { strictQuery: false }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
