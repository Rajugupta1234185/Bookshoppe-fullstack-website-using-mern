// test.js
require('dotenv').config({ path: './config.env' }); // Import .env variables
const mongoose = require('mongoose');
const User = require('./schema/userSchema');  // Import your User model

// Connect to MongoDB
mongoose.connect(process.env.MONGOURI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => {
    console.log('MongoDB connected successfully!');
    
    // Create a new user (for testing)
    const user = new User({
      fname: 'John',
      lname: 'Doe',
      email: 'john.doe@example.com',
      phone: '1234567890',
      password: 'password123'
    });

    // Save the user to the database
    user.save()
      .then((savedUser) => {
        console.log('User saved:', savedUser);
        mongoose.disconnect(); // Disconnect after saving
      })
      .catch((err) => {
        console.error('Error saving user:', err);
        mongoose.disconnect();
      });

  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
