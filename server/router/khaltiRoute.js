const express = require('express');
const axios = require('axios');

const khaltiRoute = express.Router();

// Replace this with your actual LIVE_SECRET_KEY
const KHALTI_SECRET_KEY = 'd5a07f954a34406690ab90694e30b502';

khaltiRoute.post('/verify', async (req, res) => {
    const { token, amount } = req.body;

    if (!token || !amount) {
        return res.status(400).json({ status: 'failure', message: 'Missing required fields' });
    }

    try {
        const response = await axios.post(
            'https://khalti.com/api/v2/payment/verify/',
            {
                token,
                amount,
            },
            {
                headers: {
                    Authorization: `Key ${KHALTI_SECRET_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        console.log('✅ Payment verification response:', response.data);

        // If verification is successful, send back the verified data
        res.json({
            status: 'Completed',
            data: response.data,
        });
    } catch (error) {
        console.error('❌ Error verifying payment:', error.response?.data || error.message);
        res.status(500).json({
            status: 'failure',
            message: error.response?.data?.detail || 'Verification failed',
        });
    }
});

module.exports = khaltiRoute;
