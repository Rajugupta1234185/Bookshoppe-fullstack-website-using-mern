import React, { useState } from "react";
import axios from "axios";

const ChatAssistant = () => {
    const [userMessage, setUserMessage] = useState("");
    const [response, setResponse] = useState("");

    const handleMessageChange = (e) => {
        setUserMessage(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // Make an API call to your server (backend) to send the message to OpenAI
            const result = await axios.post("http://localhost:5000/chat", {
                message: userMessage,
            });

            // Get the response from the backend and update the frontend state
            setResponse(result.data); // Assuming 'data' contains the OpenAI response
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Admin Assistant</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={userMessage}
                    onChange={handleMessageChange}
                    placeholder="Ask me something..."
                />
                <button type="submit">Send</button>
            </form>

            <div>
                <h3>Response:</h3>
                <p>{response}</p>
            </div>
        </div>
    );
};

export default ChatAssistant;
