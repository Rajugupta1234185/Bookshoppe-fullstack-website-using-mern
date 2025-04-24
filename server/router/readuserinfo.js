const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../schema/userSchema'); // Assuming you have this model for user data
const profileinfo = express.Router();

// Protect this route with token validation
profileinfo.post('/', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1]; // Get token from Authorization header

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.MYSECRETTOKENKEY);
    const user = await User.findOne({ gmail: decoded.gmail });
    console.log(user.gmail);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send user profile data as response
  return  res.status(200).json({
      gmail: user.gmail,
      fname: user.fname,
      lname: user.lname,
      phone: user.phone
      
    });
  } catch (error) {
    res.status(400).json({ message: 'Invalid token' });
  }
});

module.exports = profileinfo;
