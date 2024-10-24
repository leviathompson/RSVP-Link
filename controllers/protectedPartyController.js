const User = require("../models/userModel.js");
require("../models/partyModel.js");

const get_party = async (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    return res.status(400).json({ ok: false, message: "No user found" });
  }

  try {
    // Find the user by _id and populate the party field
    const user = await User.findById(userId).populate("party");
    if (!user || !user.party) {
      return res.status(404).json({ ok: false, message: "User or party not found" });
    }

    // Fetch all user objects based on party.users array
    const populatedUsers = await User.find({ _id: { $in: user.party.users } });

    // Replace the `users` array in the party with the actual user objects
    const partyWithUsers = {
      ...user.party.toObject(),
      users: populatedUsers
    };

    return res.status(200).json({ ok: true, party: partyWithUsers });
  } catch (error) {
    console.error("Error fetching party:", error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

module.exports = { get_party };
