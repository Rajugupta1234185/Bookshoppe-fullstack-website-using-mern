const { default: mongoose } = require("mongoose");

const userNotificationSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        productid: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true } 
    }, 
    { timestamps: true }
);

const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
module.exports = UserNotification;
