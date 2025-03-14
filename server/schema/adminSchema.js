const { default: mongoose } = require("mongoose");

const adminSchema = new mongoose.Schema(
    {
        fullname: { type: String, required: true },
        gmail: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        imageUrl: { type: String, default: null },  // Default to null if no image URL is provided
        age: { type: Number, required: true },  // Admin's age
        phoneNo: { type: String, default: null },  // Default to null if no phone number is provided
        bio: { type: String, default: null },  // Default to null if no bio is provided
    },
    { timestamps: true }
);

const Admin = mongoose.model("Admin", adminSchema);
module.exports = Admin;
