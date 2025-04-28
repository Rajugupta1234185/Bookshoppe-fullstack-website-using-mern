const express = require('express');
const User = require('../schema/userSchema');
const Seller = require('../schema/sellerSchema');

const NavbarRouter = express.Router();

// Route to fetch all user info
NavbarRouter.post('/userinfo', async (req, res) => {
    try {
        const users = await User.find(); // You can also add projection to exclude password if needed
        res.status(200).json({ success: true, users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ success: false, message: 'Server error. Unable to fetch users.' });
    }
});

// DELETE /api/users/:id
NavbarRouter.delete('/users/:id', async (req, res) => {
    const userId = req.params.id;
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      if (!deletedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json({ message: 'User removed successfully' });
    } catch (err) {
      console.error('Error deleting user:', err);
      return res.status(500).json({ message: 'Server error' });
    }
  });
  

module.exports = NavbarRouter;
