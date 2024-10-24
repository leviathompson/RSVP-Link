const User = require("../models/userModel.js");
require("../models/partyModel.js");

// Fetch user details
const get_user = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ ok: false, message: "No user found" });
  }
  try {
    // Find the user by _id and populate the party field
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }
    return res.status(200).json({ ok: true, party: user });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

// Patch user details
const patch_user = async (req, res) => {
  const userId = req.user.id;
  const { status, emails, phones } = req.body;

  if (!userId) {
    return res.status(400).json({ ok: false, message: "No user found" });
  }

  try {
    // Check for email uniqueness
    if (emails && emails.length > 0) {
      const existingEmails = await User.findOne({
        _id: { $ne: userId },
        "contactMethods.emails.address": { $in: emails.map(e => e.address) },
      });
      if (existingEmails) {
        return res.status(400).json({ ok: false, message: "One or more email addresses are already in use." });
      }
    }

    // Check for phone uniqueness
    if (phones && phones.length > 0) {
      const existingPhones = await User.findOne({
        _id: { $ne: userId },
        "contactMethods.phones.number": { $in: phones.map(p => p.number) },
      });
      if (existingPhones) {
        return res.status(400).json({ ok: false, message: "One or more phone numbers are already in use." });
      }
    }

    // Find and update user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ ok: false, message: "User not found" });
    }

    // Update user details
    if (status) {
      user.status = status;
    }

    if (emails) {
      user.contactMethods.emails = emails;
    }

    if (phones) {
      user.contactMethods.phones = phones;
    }

    // Save changes
    await user.save();

    return res.status(200).json({ ok: true, message: "User updated successfully." });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

module.exports = { get_user, patch_user };
