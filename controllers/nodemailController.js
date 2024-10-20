const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  }
});
const URL = 'http://localhost:1337/enter/';

const send_otp = async (contact, name, code) => {

  let subj, body;

  subj = "RSVP Verification Code";
  body = `<p>Your verification code is:</p><p>\r\n${code}</p><p>\r\nEnter the code on your device or click this link:</p><p>\r\n${URL}${encodeURIComponent(name)}/${code}</p>`;

  const mailOptions = {
    to: contact,
    from: process.env.NODEMAILER_EMAIL,
    subject: subj,
    html: body
  };

  try {
    const response = await transport.sendMail(mailOptions);
    console.dir(mailOptions);
    console.log('Link sent 📬');
    console.log(response);
    return { ok: true, message: 'email sent' };
  } catch (err) {
    console.log("Something didn't work out 😭", err);
    return { ok: false, message: err };
  }
};

module.exports = { send_otp };