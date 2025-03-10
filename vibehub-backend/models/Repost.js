const mongoose = require('mongoose');

const RepostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tweetId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tweet', required: true },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repost', RepostSchema);
