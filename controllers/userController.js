const User = require("../models/userModel.js");
const { censorEmail, censorPhone, formatToE164 } = require("../utils/formatter.js");
const twilio = require('twilio');
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET_KEY;

const client = twilio(accountSid, authToken);

const verify_code = async (req, res) => {
  const { userId, verificationCode, contactMethodId, contactMethodType } = req.body;
  if (!userId) {
    return res.json({ ok: false, message: "userId is required" });
  }

  if (!verificationCode) {
    return res.json({ ok: false, message: "verificationCode is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ ok: false, message: "User not found" });
    }

    let contactMethod = '';
    if (contactMethodType === 'email') {
      const email = user.contactMethods.emails.find(email => email.id === contactMethodId);
      if (!email) {
        return res.json({ ok: false, message: "Contact email not found" });
      }
      contactMethod = email.address;
    } else if (contactMethodType === 'sms') {
      const phone = user.contactMethods.phones.find(phone => phone.id === contactMethodId);
      if (!phone) {
        return res.json({ ok: false, message: "Contact phone not found" });
      }
      contactMethod = formatToE164(phone.number);
    }

    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        code: verificationCode,
        to: contactMethod,
      });

    if (verificationCheck.status === 'approved') {
      const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });

      return res.json({
        ok: true,
        message: `User verified successfully`,
        token,
      });
    } else {
      return res.status(400).json({ ok: false, message: verificationCheck.message });
    }

  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};


const trigger_otp = async (req, res) => {
  const { userId, contactMethodId, contactMethodType } = req.body;
  if (!userId) {
    return res.json({ ok: false, message: "userId is required" });
  }

  if (!contactMethodId) {
    return res.json({ ok: false, message: "contactMethodId is required" });
  }

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.json({ ok: false, message: "User not found" });
    }

    let contactMethod = '';
    if (contactMethodType === 'email') {
      const email = user.contactMethods.emails.find(email => email.id === contactMethodId);
      if (!email) {
        return res.json({ ok: false, message: "Contact email not found" });
      }
      contactMethod = email.address;
    } else if (contactMethodType === 'sms') {
      const phone = user.contactMethods.phones.find(phone => phone.id === contactMethodId);
      if (!phone) {
        return res.json({ ok: false, message: "Contact phone not found" });
      }
      contactMethod = formatToE164(phone.number);
    }

    const verification = await client.verify.v2
    .services(serviceSid)
    .verifications.create({
      channel: contactMethodType,
      to: contactMethod,
    });

    if (verification.status === 'pending') {
      return res.json({
        ok: true,
        message: `A one-time passcode has been sent.`,
        contactMethodId: contactMethodId,
        contactMethodType: contactMethodType,
      });
    } else {
      return res.status(400).json({ ok: false, message: verification.message });
    }

  } catch (error) {
    console.error("Error sending code:", error);
    return res.status(500).json({ ok: false, message: "Server error" });
  }
};

const get_user = async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.json({ ok: false, message: "Name is required" });
  }

  try {
    // Find the user by name, case-insensitive
    const user = await User.findOne({
      name: { $regex: new RegExp(`^${name}$`, "i") },
    });

    if (!user) {
      return res.json({
        ok: false,
        message: `User with name '${name}' not found`,
      });
    } else {
      // Obfuscate contact methods
      const obfuscatedContactMethods = {
        emails: user.contactMethods.emails.map(email => ({
          id: email.id,
          address: censorEmail(email.address),
        })),
        phones: user.contactMethods.phones.map(phone => ({
          id: phone.id,
          number: censorPhone(phone.number),
          carrier: phone.carrier,
        }))
      };

      // Return user with obfuscated contact methods
      return res.json({
        ok: true,
        user: {
          _id: user._id,
          name: user.name,
          contactMethods: obfuscatedContactMethods,
        }
      });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    res.json({ ok: false, message: error.message });
  }
};

module.exports = { verify_code, get_user, trigger_otp };
