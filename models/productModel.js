const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    condition: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    sellerId: {
        type: Number,
        required: true,
    },
    img: {
        type: [String], // Assuming images are URLs stored as strings
        required: true,
    },
    },
    { timestamps: true }
    );

module.exports = mongoose.model("Product", productSchema);