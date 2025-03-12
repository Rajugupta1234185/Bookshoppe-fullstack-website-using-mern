const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../schema/userSchema'); // Correct path to user schema

const registration = express.Router();
registration.use(express.json());

// POST request to register a new user
registration.post('/registration', async (req, res) => {
  const { fname, lname, gmail, phone, password } = req.body;
  console.log('Request Body:', req.body); // Log the entire body to check

  try {
    // Validate input data
    if (!fname || !lname || !gmail || !phone || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate email format using regex
    const emailRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!emailRegex.test(gmail)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ gmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Gmail already exists' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({
      fname,
      lname,
      gmail,
      phone,
      password: hashedPassword, // Save the hashed password
    });

    // Save the new user to the database
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error:', error.message); // Log the error message for debugging
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

module.exports = registration;
