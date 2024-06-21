const mongoose = require("mongoose");

const findSchema = new mongoose.Schema({
    sport: {
        type: String,
        required: true,
    },
    players: {
        type: Number,
        required: true,
    },
    arena: {
        type: String,
        required: true,
    },
    start: {
        type: String,
        required: true,
    },
    end: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    location: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    },
    },
    { timestamps: true }
    );

module.exports = mongoose.model("Find", findSchema);
