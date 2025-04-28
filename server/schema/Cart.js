// models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Books',   // Referencing the 'Books' model
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  }
}, { timestamps: true }); // Optional: adds createdAt and updatedAt fields

module.exports = mongoose.model('Cart', cartSchema);
