const { default: mongoose } = require("mongoose");

const sellerNotificationSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        msg: { type: String, required: true }
    },
    { timestamps: true }
);

const SellerNotification = mongoose.model("SellerNotification", sellerNotificationSchema);
module.exports = SellerNotification;
