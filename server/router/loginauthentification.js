const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../schema/userSchema');
const Admin= require('../schema/adminSchema');
const Seller= require('../schema/sellerSchema');
const jwt = require('jsonwebtoken');

const loginauthentification = express.Router();

loginauthentification.post('/loginauthentification', async (req, res) => {
  try {
    const { gmail, password } = req.body;
    console.log(gmail);

    const rows = 3;
    const cols = 2;
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(null));

    // USER
    const user = await User.findOne({ gmail });
    matrix[0][0] = user ? 1 : 0;
    matrix[0][1] = user && await bcrypt.compare(password, user.password) ? 1 : 0;

    // ADMIN
    const admin = await Admin.findOne({ gmail });
    matrix[1][0] = admin ? 1 : 0;
    matrix[1][1] = admin && await bcrypt.compare(password, admin.password) ? 1 : 0;

    // SELLER
    const email=gmail;
    const seller = await Seller.findOne({ email });
    matrix[2][0] = seller ? 1 : 0;
    matrix[2][1] = seller && await bcrypt.compare(password, seller.password) ? 1 : 0;

    // Generate JWT token
    const payload = { gmail: gmail || email };
    const token = jwt.sign(payload, process.env.MYSECRETTOKENKEY, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: false,
      secure: false,
      sameSite: 'Lax',
      maxAge: 3600000,
    });

    // Role Identification
    const isUser = matrix[0][0] && matrix[0][1];
    const isAdmin = matrix[1][0] && matrix[1][1];
    const isSeller = matrix[2][0] && matrix[2][1];
    console.log(isSeller);

    if (isUser && isAdmin && isSeller) {
      return res.status(200).json({ message: 'User, Admin, and Seller',id: 1 });
    }
    if (isUser && isAdmin) {
      return res.status(200).json({ message: 'User and Admin', id:2 });
    }
    if (isUser && isSeller) {
      return res.status(200).json({ message: 'User and Seller', id:3 });
    }
    if (isAdmin && isSeller) {
      return res.status(200).json({ message: 'Admin and Seller' ,id:4 });
    }
    if (isUser) {
      return res.status(200).json({ message: 'User', id:5 });
    }
    if (isAdmin) {
      return res.status(200).json({ message: 'Admin', id:6 });
    }
    if (isSeller) {
      return res.status(200).json({ message: 'Seller', id:7 });
    }

    // If none matched
    return res.status(401).json({ message: 'Invalid credentials' });

  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


module.exports = loginauthentification;
