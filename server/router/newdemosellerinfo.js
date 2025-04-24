const express = require('express');
const newdemoseller = require('../schema/demoSellerSchema');

const demosellerinfo = express.Router();

// GET endpoint to count pending sellers
demosellerinfo.get('/pending', async (req, res) => {
    try {
        const pendingCount = await newdemoseller.countDocuments({ status: "Pending" });
        console.log("pendingcount",pendingCount);
        res.json({ count: pendingCount });
    } catch (error) {
        console.error("Error fetching pending sellers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

module.exports = demosellerinfo;
