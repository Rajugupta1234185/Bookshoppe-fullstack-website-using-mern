// models/Book.js
const mongoose = require('mongoose');


const bookSchema = new mongoose.Schema({
  bookName: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  originalPrice: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  bookImageUrl: {
    type: String,
    required: true,
  },
  previewPageUrls: {
    type: [String],
    default: [],
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  offer: {
    type: Number,
    default: 0,
  },
  categories: {
    type: [String],
    default: [],
  },
  email: {
    type: String,
    required: true
  }
}
);

module.exports = mongoose.model('Books', bookSchema);
