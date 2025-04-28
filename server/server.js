require('dotenv').config({ path: './config.env' });
const mongoose = require('mongoose');
require('./database_conn/connect');

const express = require('express');
const app = express();

const cors = require('cors');
const cookieParser = require('cookie-parser'); // ✅ Add this to read token from cookies

app.use(cors({
  origin: 'http://localhost:3000', // ✅ Replace with your frontend URL
  credentials: true, // ✅ This is needed for cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Allow these methods
}));

app.use(cookieParser()); // ✅ Middleware to parse cookies
app.use(express.json()); // ✅ Parse JSON requestss

// 🛣️ Import routes
const registration = require('./router/registration');
const loginauthentification = require('./router/loginauthentification');
const otpRoute = require('./router/otpRoutes');
const updateUserinfo = require('./router/updateUserinfo');
const protectedRoute = require('./router/protectedRoute'); // ✅ FIXED: Typo & removed semicolon
const profileinfo=require('./router/readuserinfo');
const demoSellerRoute=require('./router/demoSellerRoute');

const admin=require('./schema/adminSchema');
const newdemosellerinfo=require('./router/newdemosellerinfo');
const demosellerinfo =require('./router/demosellerinfo');
const addbook=require('./router/bookRoute');
const path = require('path');
const sellerComplaintRoute = require('./router/sellerComplaintRoute');
const adminsentnotification=require('./router/adminsentNotificationRoute');
const adminfetchingroute= require('./router/adminNavbarfetchingRoute');
const cart=require('./router/cartRoute');
const khalti=require('./router/khaltiRoute');

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// 🛣️ Use routes
app.use('/api/registration', registration);
app.use('/api/loginauthentification', loginauthentification);
app.use('/api/sendotp', otpRoute);
app.use('/api/verifyotp', otpRoute);
app.use('/api/updatepassword', updateUserinfo);
app.use('/api/protectedroute', protectedRoute); // ✅
app.use('/api/getprofile',profileinfo);
app.use('/api/demosellerroute',demoSellerRoute);
app.use('/api/demoseller', newdemosellerinfo);
app.use('/api/demosellerinfo',demosellerinfo);
app.use('/api/addbook',addbook);
app.use('/api/sellercomplaint', sellerComplaintRoute);
app.use('/api/sent',adminsentnotification);
app.use('/api/fetch', adminfetchingroute);
app.use('/api/cart',cart);
app.use('/api/khalti',khalti);



app.get('/something', (req, res) => {
  res.cookie('testCookie', 'testValue', { httpOnly: true, secure: false, maxAge: 3600000 });
  res.send('Cookie set!');
});
// app.get('/', async (req, res) => {
//   try {
//     const plainPassword = 'Raju@1234';

//     // ✅ Hash the password
//     const salt = await bcrypt.genSalt(10);
//     const hashedPassword = await bcrypt.hash(plainPassword, salt);

//     const newAdmin = {
//       fullname: 'Raju Gupta',
//       gmail: '077bel031.raju@pcampus.edu.np',
//       password: hashedPassword, // ✅ Use hashed password
//       imageUrl: 'bookshopping/public/admin image/Raju.jpeg',
//       age: 23,
//       phoneNo: '9812042867',
//       bio: 'I am fighting with myself.'
//     };

//     // ✅ Check if admin already exists to avoid duplicates
//     const existingAdmin = await admin.findOne({ gmail: newAdmin.gmail });
//     if (existingAdmin) {
//       return res.status(409).send("Admin already exists!");
//     }

//     const adminData = new admin(newAdmin);
//     const saved = await adminData.save();

//     console.log("✅ Admin inserted with hashed password:", saved);
//     res.status(200).send("Admin inserted successfully!");
//   } catch (err) {
//     console.error("❌ Error inserting admin:", err.message);
//     res.status(500).send("Something went wrong!");
//   }
// });




const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
