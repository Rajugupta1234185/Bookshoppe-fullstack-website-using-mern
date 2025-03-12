const express = require('express');
const route = express.Router();
route.use(express.json());

const bcrypt = require ( 'bcryptjs'); // To hash passwords securely
const User=require( '../schema/userSchema'); // Adjust the path based on your project

// POST route to update password based on Gmail
route.post('/updateUserinfo', async (req, res) => {
    const { gmail, newpassword} = req.body; // Extract email and newPassword from the request body
  

    try {
        // Check if the user exists by email
        const user = await User.findOne({ gmail });
        
        if(!user){
            alert('user doesnot existed');
        }

        // Hash the new password before saving
        const hashedPassword = await bcrypt.hash(newpassword, 10);

        // Update the password
        user.password = hashedPassword;
        await user.save();

        // Return success message
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error, please try again' });
    }
});

module.exports=route;
