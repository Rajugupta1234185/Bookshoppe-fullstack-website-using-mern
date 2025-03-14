const { default: mongoose } = require("mongoose");

const cartSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
    }, 
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
