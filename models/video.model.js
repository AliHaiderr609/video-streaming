const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    url: { type: String, required: true },
    hashtags: { type: String },
});

module.exports = mongoose.model('Video', videoSchema);