const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    hashtags: [{ type: String }],
    likesCount: { type: Number, default: 0 },
    repostsCount: { type: Number, default: 0 },
    commentsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema) ;