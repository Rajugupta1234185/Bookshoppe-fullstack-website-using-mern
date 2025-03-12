const express = require('express');
require('dotenv').config({ path: './config.env' });
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const router = express.Router();
router.use(express.json());

// Store OTPs temporarily in memory, can use Redis or database for production

let otpStore = {};
// Create a transporter for email using Nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASSWORD, // Use environment variables for security in production
  },
});

// OTP generation function
function generateOTP() {
  return crypto.randomInt(100000, 999999).toString(); // Numeric OTP
}

// Route for sending OTP
router.post('/send-otp', (req, res) => {
  const { gmail } = req.body;

  if (!gmail) {
    return res.status(400).json({ message: `${gmail}` });
  }

  // Generate OTP
  const otp = generateOTP();
 

  // Store OTP temporarily in memory
  otpStore[gmail] = otp;

  // Set OTP expiration (e.g., 5 minutes)
  setTimeout(() => {
    delete otpStore[gmail];
  }, 5 * 60 * 1000); // 5 minutes expiry

  // Send OTP email
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: gmail,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  };

  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'Failed to send OTP email.' });
    }
    return res.status(200).json({ message: 'OTP sent successfully.' });
  });
});

// Route for verifying OTP
router.post('/verify-otp', (req, res) => {
  const { gmail, otp } = req.body;
  
  if (otpStore[gmail] === otp) {
    delete otpStore[gmail]; // Remove OTP after successful verification
    return res.status(200).json({ message: 'OTP verified successfully.' });
  } else {
    return res.status(400).json({ message: `${gmail},${otp},${otpStore[gmail]}` });
  }
});

module.exports = router;
