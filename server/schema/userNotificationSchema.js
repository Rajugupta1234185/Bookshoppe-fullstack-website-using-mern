const { default: mongoose } = require("mongoose");

const userNotificationSchema = new mongoose.Schema(
    {
        gmail: { type: String, required: true },
        msg:{type:String,require:true}
    }, 
    { timestamps: true }
);

const UserNotification = mongoose.model("UserNotification", userNotificationSchema);
module.exports = UserNotification;
