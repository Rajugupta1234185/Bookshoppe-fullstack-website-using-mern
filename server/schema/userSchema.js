const mongoose = require('mongoose');

// Define the Schema
const userSchema = new mongoose.Schema({
  fname: { type: String, required: true },
  lname: { type: String, required: true },

  gmail: { type: String, required: true, unique: true },
  phone: { type:String, required:true },
  password: {type:String, required:true}
}, { timestamps: true }); // Adds createdAt and updatedAt automatically

// Create a Model
const User = mongoose.model('USERS', userSchema);

// Export the model
module.exports = User;
