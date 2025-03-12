const { default: mongoose } = require("mongoose");

const wishlistSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true }
    }, 
    { timestamps: true }
);

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;
