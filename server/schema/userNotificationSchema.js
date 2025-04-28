const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  email: { type: String, required: true },         // User's email
  title: { type: String, required: true },         // Title of the notification
  message: { type: String, required: true },       // Body of the message
  isSeen: { type: Boolean, default: false },       // Whether the user has seen the notification
  createdAt: { type: Date, default: Date.now }     // Timestamp
});

module.exports = mongoose.model('Notification', notificationSchema);
