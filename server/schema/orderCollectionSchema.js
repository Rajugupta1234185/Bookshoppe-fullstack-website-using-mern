const { default: mongoose } = require("mongoose");

const orderCollectionSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        status: { type: String, enum: ["pending", "shipped", "delivered", "canceled"], default: "pending" }
    }, 
    { timestamps: true }
);

const OrderCollection = mongoose.model("OrderCollection", orderCollectionSchema);
module.exports = OrderCollection;
