const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// Email and Phone Schemas remain the same
const EmailSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  address: {
    type: String,
    required: false,
    unique: false,
    lowercase: true,
  },
  primary: {
    type: Boolean,
    default: false,
  },
});

const PhoneSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: () => new mongoose.Types.ObjectId(),
  },
  number: {
    type: String,
    required: false,
    unique: false,
  },
});

// User Schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: false,
      select: false,
    },
    contactMethods: {
      emails: [EmailSchema],
      phones: [PhoneSchema],
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Party",
    },
    status: {
      type: String,
      required: true,
      enum: ["Awaiting response", "Attending", "Not attending"],
      default: "Awaiting response",
    },
  },
  {
    strictQuery: false,
  }
);

// Pre-save hook to ensure only one primary email
UserSchema.pre("save", function (next) {
  const user = this;
  if (user.contactMethods.emails.filter((email) => email.primary).length > 1) {
    return next(new Error("Only one email can be set as primary."));
  }
  next();
});

// Hash password before saving
UserSchema.pre("save", async function (next) {
  const user = this;
  if (!user.isModified("password")) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(user.password, salt);
    user.password = hashedPassword;
    next();
  } catch (error) {
    return next(error);
  }
});

// Method to compare input password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
