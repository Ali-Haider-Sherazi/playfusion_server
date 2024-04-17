const mongoose = require("mongoose");

const matchSchema = new mongoose.Schema({
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
    matchUserId: {
        type: [String],
        required: true,
    },
    acceptedUserId: {
        type: [String],
        required: true,
    },
    completeStatus: {
        type: String,
        required: true,
    },
    },
    { timestamps: true }
    );

module.exports = mongoose.model("Match", matchSchema);