// models/DemoSeller.js
const mongoose = require("mongoose");

const demoSellerSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  gender: String,
  phone: String,
  email: { type: String, unique: true },
  password: String,
  store: String,
  address: String,
  gstin: { type: String, default: "" },
  bankname: String,
  account: String,
  ifsc: String,
  status: { type: String, default: "Pending" }, // 'Pending', 'Approved', 'Rejected'
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("DemoSeller", demoSellerSchema);
