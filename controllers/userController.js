const User = require("../models/userModel.js");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
const { v4: uuidv4 } = require("uuid");
const { send_magic_link } = require("./nodemailController.js");
const { censorEmail, censorPhone } = require("../utils/formatter.js");

const get_carrier = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return res.json({ ok: false, message: "Name is required" });
  }

  console.log(`Received carrier request for name: ${name}`);

  try {
    // Find the user by name, case-insensitive
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    console.log(`User found: ${user ? JSON.stringify(user) : "None"}`);

    if (!user) {
      return res.json({
        ok: false,
        message: `User with name '${name}' not found`,
      });
    }

    if (!user.carrier) {
      return res.json({
        ok: false,
        message: `User with name '${name}' has no carrier`,
      });
    } else {
      return res.json({ ok: true, carrierId: user.carrier });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({ ok: false, message: error });
  }
};

const login = async (req, res) => {
  const { name, carrier, magicLink } = req.body;
  if (!name) {
    return res.json({ ok: false, message: "Name is required" });
  }

  console.log(`Received login request for name: ${name}`);

  try {
    // Find the user by name, case-insensitive
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });
    console.log(`User found: ${user ? JSON.stringify(user) : "None"}`);

    if (!user) {
      return res.json({
        ok: false,
        message: `User with name '${name}' not found`,
      });
    }

    // Determine the email or phone for authentication
    let contactMethod = user.email;
    let censoredContact = contactMethod ? censorEmail(contactMethod) : null;
    let contactType = "email";

    if (!contactMethod) {
      if (!user.phone) {
        return res.json({
          ok: false,
          message: "No email or phone available for authentication",
        });
      }
      console.log(`sending text to ${user.phone}@${carrier.smsGatewayDomain}`);
      contactMethod = `${user.phone}@${carrier.smsGatewayDomain}`;
      censoredContact = censorPhone(user.phone);
      contactType = "phone";
    }

    if (!magicLink) {
      // Update magic link
      try {
        const updatedUser = await User.findOneAndUpdate(
          { name: user.name },
          { magicLink: uuidv4(), magicLinkExpired: false },
          { returnDocument: "after" }
        );
        console.log(`Updated user: ${JSON.stringify(updatedUser)}`);
        // Send magic link
        send_magic_link(
          contactMethod,
          user.name,
          updatedUser.magicLink,
          "signin"
        );
        res.send({
          ok: true,
          message: `A magic link has been sent to your ${contactType}: ${censoredContact}`,
        });
      } catch (error) {
        res.json({ ok: false, message: error });
      }
    } else if (user.magicLink === magicLink && !user.magicLinkExpired) {
      // If magic link is valid, sign JWT and authenticate
      const token = jwt.sign(user.toJSON(), jwt_secret, { expiresIn: "1h" });

      // Mark the magic link as expired before sending the response
      await User.findOneAndUpdate(
        { name: user.name },
        { magicLinkExpired: true }
      );

      res.json({
        ok: true,
        message: "Welcome back",
        token,
        email: contactMethod,
      });
    } else {
      return res.json({
        ok: false,
        message: "Magic link expired or incorrect 🤔",
      });
    }
  } catch (error) {
    console.error("Error during login:", error);
    res.json({ ok: false, message: error });
  }
};

const verify_token = (req, res) => {
  console.log(req.headers.authorization);
  const token = req.headers.authorization;
  jwt.verify(token, jwt_secret, (err, succ) => {
    err
      ? res.json({ ok: false, message: "something went wrong" })
      : res.json({ ok: true, succ });
  });
};

module.exports = { login, verify_token, get_carrier };
