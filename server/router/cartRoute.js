// routes/cart.js
const express = require('express');
const Cart = require('../schema/Cart')
const Book = require('../schema/Book');
const cartRoute = express.Router();
const jwt = require('jsonwebtoken');

const Seller= require('../schema/sellerSchema');
require('dotenv').config({ path: './config.env' });

// Add to Cart
cartRoute.post('/add', async (req, res) => {
  try {
    const { token, bookId, quantity } = req.body;

    const decoded=jwt.verify(token,process.env.MYSECRETTOKENKEY);
    const email=decoded.gmail;
    
    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Check if book is already in the cart
    let cartItem = await Cart.findOne({ email, bookId });

    if (cartItem) {
      // If it exists, update the quantity
      cartItem.quantity += quantity;
      await cartItem.save();
      return res.status(200).json({ message: "Quantity updated" });
    }

    // If not in cart, create new cart item
    cartItem = new Cart({ email, bookId, quantity });
    await cartItem.save();
    res.status(201).json({ message: "Book added to cart", cartItem });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// routes/cart.js
// Update Cart Item Quantity
cartRoute.put('/update/:cartId', async (req, res) => {
    try {
      const { quantity } = req.body;
      const cartItem = await Cart.findById(req.params.cartId);
  
      if (!cartItem) {
        return res.status(404).json({ message: "Cart item not found" });
      }
  
      cartItem.quantity = quantity;
      await cartItem.save();
  
      res.status(200).json({ message: "Cart updated", cartItem });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  });
  

  // routes/cart.js
// Remove from Cart
cartRoute.post('/removecart', async (req, res) => {
    const { token, id } = req.body;
    try {
        const cartItem = await Cart.findByIdAndDelete(id);  // Fix is here

        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        res.status(200).json({ message: "Book removed from cart" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});




  // routes/cart.js
// Get Cart Items (with populated book details)
cartRoute.post('/getcart', async (req, res) => {
    const { token } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.MYSECRETTOKENKEY);
        const email = decoded.gmail;
        console.log("i am from getcart", email);

        // Find the cart items by email
        const cartItems = await Cart.find({ email: email });
        console.log("cartitems",cartItems);

        if (!cartItems || cartItems.length === 0) {
            return res.status(404).json({ message: "No items in cart" });
        }

        // Create an array of cart items with book details
        const cartWithBookDetails = [];

        // Loop through cart items and fetch book details from the Book model
        for (let item of cartItems) {
            const book = await Book.findById(item.bookId);
            if (book) {
                const { bookName, originalPrice, offer, bookImageUrl } = book;
                cartWithBookDetails.push({
                    cartId: item._id,
                    bookName,
                    originalPrice,
                    offer,
                    quantity: item.quantity,
                    bookImageUrl
                });
            }
        }

        // Return the updated cart details
        res.status(200).json(cartWithBookDetails);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


//checkout single  cart items and remove

cartRoute.post('/checkout', async (req, res) => {
    const { id } = req.body;

    try {
        const cartItem = await Cart.findById(id);
        if (!cartItem) {
            return res.status(404).json({ message: "Cart item not found" });
        }

        const bookInfo = await Book.findById(cartItem.bookId);
        if (!bookInfo) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (bookInfo.quantity < cartItem.quantity) {
            return res.status(400).json({ 
                message: `Sorry, we only have ${bookInfo.quantity} books available. Please decrease your book count to proceed.` 
            });
        }

        const seller = await Seller.findOne({ email: bookInfo.email });
        if (!seller) {
            return res.status(404).json({ message: "Seller not found" });
        }

        const checkoutData = {
            bookName: bookInfo.bookName,
            offer: bookInfo.offer,
            originalPrice: bookInfo.originalPrice,
            quantity: cartItem.quantity,
            fname: seller.fname,
            lname: seller.lname,
            shopname: seller.store,
            phone: seller.phone,
            address: seller.address
        };

        res.status(200).json(checkoutData);

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



  
  

module.exports = cartRoute;
