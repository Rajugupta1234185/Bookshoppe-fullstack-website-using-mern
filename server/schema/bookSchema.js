const { default: mongoose } = require("mongoose");

const bookSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        author: { type: String, required: true },
        description: { type: String, required: true },
        price: { type: Number, required: true },
        category: { type: String, required: true },
        imageurl: { type: String, required: true },
        seller: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true },
        quantity: { type: Number, required: true, default: 1 }
    },
    { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;
