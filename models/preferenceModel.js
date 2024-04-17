const mongoose = require('mongoose');

const preferenceSchema = new mongoose.Schema({
    start: {
        type: String,
        required: true
    },
    end: {
        type: String,
        required: true
    },
    location: {
        type: [String],
        required: true
    },
    userId: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Preference = mongoose.model('Preference', preferenceSchema);

module.exports = Preference;