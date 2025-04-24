const express = require('express');
const verifyToken = require('./verifyToken');

const router = express.Router();

router.get('/', verifyToken, (req, res) => {
  res.status(200).json({
    message: 'Access granted to protected route!',
    user: req.user
  });
});

module.exports = router;
