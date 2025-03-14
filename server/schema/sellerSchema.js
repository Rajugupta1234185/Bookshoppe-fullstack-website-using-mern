const { default: mongoose } = require("mongoose");

const sellerSchema = new mongoose.Schema(
    {
        firstname: { type: String, required: true },
        lastname: { type: String, required: true },
        contact: { type: String, required: true },
        gmail: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profession: { type: String, required: true },
        status: { type: String, default: "active" }
    },
    { timestamps: true }
);

const Seller = mongoose.model("Seller", sellerSchema);
module.exports = Seller;
