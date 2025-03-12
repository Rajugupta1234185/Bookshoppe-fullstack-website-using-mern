
require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
require('./database_conn/connect');




// Import the OpenAI API function
const { callOpenAIAPI } = require('./OpenAi_API');


const express = require('express');
const app = express();

const cors = require('cors');
app.use(cors());

const registration = require('./router/registration');
const loginauthentification=require('./router/loginauthentification');

const otpRoute= require('./router/otpRoutes');

const PORT = process.env.PORT; // Fallback to 5000 if PORT is not defined in env
const updateUserinfo=require('./router/updateUserinfo');

// ✅ Add middleware to parse JSON requests
app.use(express.json());

app.use('/api/registration', registration);
app.use('/api/loginauthentification',loginauthentification);
app.use('/api/sendotp',otpRoute);
app.use('/api/verifyotp',otpRoute);
app.use('/api/updatepassword',updateUserinfo);

// API endpoint that connects your React frontend to OpenAI API through your server
app.post("/chat", async (req, res) => {
    const { message } = req.body;
    
    try {
        // Call the external API that interacts with OpenAI
        const openAIResponse = await callOpenAIAPI(message);
        
        // Send the response back to the frontend
        res.json(openAIResponse);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error with API");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
