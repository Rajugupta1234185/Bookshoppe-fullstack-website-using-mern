
const mongoose = require('mongoose');

const userComplaintSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Not Reviewed', 'Reviewed'],
    default: 'Not Reviewed', // 🟡 Default status
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('UserComplaint', userComplaintSchema);
