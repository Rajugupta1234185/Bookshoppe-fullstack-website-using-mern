const { default: mongoose } = require("mongoose");

const bookReviewSchema = new mongoose.Schema(
    {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true },
        review: { type: String, required: true }
    },
    { timestamps: true }
);

const BookReview = mongoose.model("BookReview", bookReviewSchema);
module.exports = BookReview;
