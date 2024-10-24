const User = require("../models/userModel.js");
const { censorEmail, censorPhone, formatToE164 } = require("../utils/formatter.js");
const twilio = require('twilio');
const jwt = require('jsonwebtoken');

const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const serviceSid = process.env.TWILIO_SERVICE_SID;
const secretKey = process.env.JWT_SECRET_KEY;

const client = twilio(accountSid, authToken);

const findContactMethod = (user, contactMethodId, type) => {
  if (type === 'email') {
    return user.contactMethods.emails.find(email => email.id === contactMethodId);
  } else if (type === 'sms') {
    return user.contactMethods.phones.find(phone => phone.id === contactMethodId);
  }
  return null;
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ ok: false, message: "Email and password are required" });
  }

  try {
    // Find the user by email
    const user = await User.findOne({ "contactMethods.emails.address": email }).select('+password');

    if (!user) {
      return res.status(400).json({ ok: false, message: "Invalid email or password" });
    }

    // Find the email marked as primary (if applicable)
    const primaryEmail = user.contactMethods.emails.find(emailObj => emailObj.address === email && emailObj.primary);

    if (!primaryEmail) {
      return res.status(400).json({ ok: false, message: "Email not found or not marked as primary" });
    }

    // Compare passwords
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ ok: false, message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign({ id: user._id }, secretKey, { expiresIn: '1h' });

    return res.json({
      ok: true,
      message: "Login successful",
      token,
    });

  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ ok: false, message: "Server error. Please try again later." });
  }
};

const verify_code = async (req, res) => {
  const { userId, verificationCode, contactMethodId, contactMethodType } = req.body;
  if (!userId || !verificationCode) {
    return res.json({ ok: false, message: "userId and verificationCode are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ ok: false, message: "Guest not found" });
    }

    const contactMethod = findContactMethod(user, contactMethodId, contactMethodType);
    if (!contactMethod) {
      return res.json({ ok: false, message: `Contact ${contactMethodType} not found` });
    }

    const to = contactMethodType === 'email' ? contactMethod.address : formatToE164(contactMethod.number);
    const verificationCheck = await client.verify.v2
      .services(serviceSid)
      .verificationChecks.create({
        code: verificationCode,
        to,
      });

    if (verificationCheck.status === 'approved') {
      const token = jwt.sign({ id: userId }, secretKey, { expiresIn: '1h' });
      return res.json({ ok: true, message: `User verified successfully`, token });
    } else {
      console.dir(verificationCheck);
      return res.status(400).json({ ok: false, message: "Verification failed, please check your code and try again." });
    }

  } catch (error) {
    console.error("Error verifying code:", error);
    return res.status(500).json({ ok: false, message: "Error verifying code. Please try again later." });
  }
};

const trigger_otp = async (req, res) => {
  const { userId, contactMethodId, contactMethodType } = req.body;
  if (!userId || !contactMethodId) {
    return res.json({ ok: false, message: "userId and contactMethodId are required" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ ok: false, message: "Guest not found" });
    }

    const contactMethod = findContactMethod(user, contactMethodId, contactMethodType);
    if (!contactMethod) {
      return res.json({ ok: false, message: `Contact ${contactMethodType} not found` });
    }

    const to = contactMethodType === 'email' ? contactMethod.address : formatToE164(contactMethod.number);
    const verification = await client.verify.v2
      .services(serviceSid)
      .verifications.create({
        channel: contactMethodType,
        to,
      });

    if (verification.status === 'pending') {
      return res.json({ ok: true, message: `A one-time passcode has been sent.`, contactMethodId, contactMethodType });
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
    const user = await User.findOne({ name: { $regex: new RegExp(`^${name}$`, "i") } });

    if (!user) {
      return res.json({ ok: false, message: `Guest with name '${name}' not found` });
    } else {
      const obfuscatedContactMethods = {
        emails: user.contactMethods.emails.map(email => ({
          id: email.id,
          address: censorEmail(email.address),
        })),
        phones: user.contactMethods.phones.map(phone => ({
          id: phone.id,
          number: censorPhone(phone.number),
        }))
      };

      return res.json({ ok: true, user: { _id: user._id, name: user.name, contactMethods: obfuscatedContactMethods } });
    }
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({ ok: false, message: "Error fetching user. Please try again later." });
  }
};

module.exports = { verify_code, get_user, trigger_otp, login };
