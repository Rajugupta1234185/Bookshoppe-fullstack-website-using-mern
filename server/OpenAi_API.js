import OpenAI from 'openai';

// Initialize OpenAI API
const openai = new OpenAI({
  apiKey: process.env.OPENAPI_KEY, // Use the API key from environment variables
});

// Function to make a chat completion request
export const callOpenAIAPI = async (message) => {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',  // Use the model you prefer
      store: true,
      messages: [
        { role: 'user', content: message },  // Dynamic user message
      ],
    });

    return completion.choices[0].message.content;  // Return the AI response
  } catch (error) {
    console.error('Error with OpenAI API:', error);
    throw error;
  }
};
