// router/sellerComplaintRoute.js
const express = require('express');
const router = express.Router();
const SellerComplaint = require('../schema/sellerComplaintSchema');

router.post('/submit', async (req, res) => {
  const { email, text } = req.body;

  if (!email || !text) {
    return res.status(400).json({ error: 'Email and complaint text are required.' });
  }

  try {
    const complaint = new SellerComplaint({ email, text,status: 'Not Reviewed' });
    const saved = await complaint.save();
    res.status(200).json({ message: 'Complaint submitted successfully!', data: saved });
  } catch (err) {
    console.error('❌ Error saving complaint:', err.message);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

module.exports = router;
