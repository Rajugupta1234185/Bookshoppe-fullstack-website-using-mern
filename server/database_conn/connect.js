

// Import Mongoose
const mongoose = require('mongoose');




// MongoDB Atlas Connection String (replace with your actual details)
const mongoURI = process.env.MONGOURI;

// Connect to MongoDB Atlas using Mongoose
mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected successfully!');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB:', err);
  });
