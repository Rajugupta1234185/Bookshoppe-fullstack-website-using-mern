const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Book = require('../schema/Book');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: './config.env' });

const bookRoute = express.Router();

// Middleware to parse JSON
bookRoute.use(express.json());

// Create uploads directory if it doesn't exist
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Save to 'uploads' directory
  },
  filename: (req, file, cb) => {
    // Dynamically generate unique filename
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName); // Use unique name with extension
  }
});

// Configure multer to accept different fields and restrict file types
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/jpg','image/webp'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true); // Accept file
  }
}).fields([
  { name: 'bookImageUrl', maxCount: 1 }, // Only 1 image for book cover
  { name: 'previewPageUrls', maxCount: 10 } // Up to 10 preview images
]);

// Route to add a new book with image and preview pages
bookRoute.post('/addBook', (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        return res.status(400).json({ message: `Multer error: ${err.message}` });
      }
      return res.status(400).json({ message: `Upload error: ${err.message}` });
    }
    next(); // Proceed if no error
  });
}, async (req, res) => {
  const {
    bookName,
    author,
    originalPrice,
    description,
    quantity,
    offer,
    categories,
    token,
  } = req.body;



  try {
    // Get uploaded files
    const mainImageFile = req.files['bookImageUrl'] ? req.files['bookImageUrl'][0] : null;
    console.log("Mainimagefile",mainImageFile);
    const previewFiles = req.files['previewPageUrls'] || [];

    // Construct URLs for uploaded files
    const bookImageUrl = mainImageFile ? `/uploads/${mainImageFile.filename}` : '';
    const previewPageUrls = previewFiles.map(file => `/uploads/${file.filename}`);

    //get seller email

    const decoded=jwt.verify(token, process.env.MYSECRETTOKENKEY);
    const email=decoded.email||decoded.gmail;

    console.log("from add book",email);

    // Create new book object
    const newBook = new Book({
      bookName,
      author,
      originalPrice,
      description,
      bookImageUrl,
      previewPageUrls,
      quantity,
      offer,
      categories,
      email
    });

    // Save the new book in the database
    await newBook.save();

    res.status(201).json({ message: 'Book added successfully!', book: newBook });
  } catch (error) {
    console.error('Error adding book:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Route to fetch all books
bookRoute.post('/getBooks', async (req, res) => {
  const{token}=req.body;

  const decoded=jwt.verify(token,process.env.MYSECRETTOKENKEY);
  const email=decoded.gmail;
  try {
    console.log("I am from bookRoutes");
    const books = await Book.find({email:email});
    res.status(200).json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// DELETE endpoint (using POST as per your client)
bookRoute.post('/delete', async (req, res) => {
  try {
    const { email, bookName } = req.body;

    // 1) Validate inputs
    if (!email || !bookName) {
      return res
        .status(400)
        .json({ message: 'Both email and bookName are required.' });
    }

    // 2) Attempt to find and delete the book
    const deleted = await Book.findOneAndDelete({ email, bookName });

    // 3) If nothing was deleted, respond 404
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'No book found for that email + name.' });
    }

    // 4) Success
    return res.json({
      message: 'Book deleted successfully.',
      book: deleted
    });
  } catch (err) {
    console.error('Error in /delete route:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
});


///=--------------update block----------------------
bookRoute.post(
  
  '/update',
  // Multer middleware for optional file uploads
 (req, res, next) => {
    upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ message: `Upload error: ${err.message}` });
      }
      next();
    });
  },
  async (req, res) => {
    try {
      const {
        bookName,
        author,
        originalPrice,
        description,
        quantity,
        offer,
        categories
      } = req.body;
      console.log("i am from bookRoute.update");

      if (!bookName) {
        return res.status(400).json({ message: 'bookName is required to identify the book' });
      }

      // 1) Load existing record
      const existingBook = await Book.findOne({ bookName });
      if (!existingBook) {
        return res.status(404).json({ message: 'Book not found' });
      }

      // 2) Pick up any new files
      const mainImageFile = req.files['bookImageUrl']?.[0] || null;
      const previewFiles    = req.files['previewPageUrls']   || [];

      // 3) Build updatedFields with fallbacks
      const updatedFields = {
        // Text fields: use incoming value if non-empty, else keep existing
        author:        (author && author.trim())        ? author.trim()        : existingBook.author,
        originalPrice: (originalPrice && originalPrice.trim())
                       ? originalPrice.trim() : existingBook.originalPrice,
        description:   (description && description.trim())
                                              ? description.trim()   : existingBook.description,
        quantity:      (quantity && quantity.trim())    ? quantity.trim()      : existingBook.quantity,
        offer:         (offer && offer.trim())          ? offer.trim()         : existingBook.offer,
        categories:    (categories && categories.trim())
                                              ? categories.trim()    : existingBook.categories,

        // File fields: new upload → use it, otherwise keep existing URL
        bookImageUrl:    mainImageFile
                          ? `/uploads/${mainImageFile.filename}`
                          : existingBook.bookImageUrl,

        previewPageUrls: previewFiles.length > 0
                          ? previewFiles.map(f => `/uploads/${f.filename}`)
                          : existingBook.previewPageUrls
      };

      // 4) Apply the update
      const updatedBook = await Book.findByIdAndUpdate(
        existingBook._id,
        { $set: updatedFields },
        { new: true }
      );

      res.status(200).json({
        message: 'Book updated successfully',
        book:    updatedBook
      });
    } catch (error) {
      console.error('Error updating book:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
);

// DELETE route
bookRoute.post('/delete', async (req, res) => {
  try {
    // 1) Destructure email and bookName from the request body
    const { email, bookName } = req.body;

    // 2) Validate presence
    if (!email || !bookName) {
      return res
        .status(400)
        .json({ message: 'Both email and bookName are required' });
    }

    // 3) (Optional) Verify ownership: ensure the book to delete belongs to this email
    //    If you store an `email` field on Book, you can do:
    // const existing = await Book.findOne({ bookName, email });
    // if (!existing) {
    //   return res.status(404).json({ message: 'Book not found or you do not have permission' });
    // }

    // 4) Perform the deletion
    const deleted = await Book.findOneAndDelete({ bookName, email });
    if (!deleted) {
      return res
        .status(404)
        .json({ message: 'No matching book found for that email' });
    }

    // 5) Respond success
    res.json({ message: 'Book deleted successfully', book: deleted });
  } catch (err) {
    console.error('Error in delete route:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

bookRoute.post('/getemail',async(req,res)=>{
  const { token } = req.body;

  try {
    const decoded = jwt.verify(token, process.env.MYSECRETTOKENKEY);
    const email = decoded.email || decoded.gmail;
    res.status(200).json({ email });
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

bookRoute.post('/getbooksdashboard', async (req, res) => {
  try {
    const fictionbooks = await Book.find({ "categories.0": "Fiction" });
    const romanticbooks = await Book.find({ "categories.0": "Romantic" });
    const businessbooks = await Book.find({ "categories.0": "Business" });
    const kidbooks = await Book.find({ "categories.0": "Kid" });
    const biographybooks = await Book.find({ "categories.0": "Biography" });

    res.json({
      fictionbooks,
      romanticbooks,
      businessbooks,
      kidbooks,
      biographybooks
    });
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: "error occurred" });
  }
});




module.exports = bookRoute;
