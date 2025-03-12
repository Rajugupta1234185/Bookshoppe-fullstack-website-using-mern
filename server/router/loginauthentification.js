const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../schema/userSchema');

const loginauthentification = express.Router();

loginauthentification.post('/loginauthentification', async (req, res) => {
    try {
        const { gmail, password } = req.body;

        // Check if user exists
        const user = await User.findOne({ gmail });
        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = loginauthentification;
