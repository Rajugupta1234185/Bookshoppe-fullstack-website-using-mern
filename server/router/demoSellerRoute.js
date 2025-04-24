// routes/demoSellerRoute.js
const express = require("express");
const bcrypt = require("bcryptjs");
const DemoSeller = require("../schema/demoSellerSchema.js"); // correct path

const demoSellerRoute = express.Router();
demoSellerRoute.use(express.json());

demoSellerRoute.post('/registerdemoseller', async (req, res) => {
  const {
    fname,
    lname,
    gender,
    phone,
    email,
    password,
    store,
    address,
    gstin,
    bankname,
    account,
    ifsc
  } = req.body;

  console.log(password);

  try {
 

 

    // Check for existing seller
    const existing = await DemoSeller.findOne({ email });
    if (existing) {
      console.log("user already in database");
      return res.status(402).json({ message: "Seller with this email already exists" });
     
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newDemoSeller = new DemoSeller({
      fname,
      lname,
      gender,
      phone,
      email,
      password,
      store,
      address,
      gstin,
      bankname,
      account,
      ifsc
    });

    await newDemoSeller.save();

    res.status(201).json({ message: "Registration is in process. You will be notified soon. Thank you!!!" });
  } catch (error) {
    console.error("Error registering demo seller:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = demoSellerRoute;
