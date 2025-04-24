// models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  rating: {
    type: Number, // Rating scale (1 to 5)
    required: true,
    min: 1,
    max: 5,
  },
  date: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('Review', reviewSchema);
