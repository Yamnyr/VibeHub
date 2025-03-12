const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    media: [{ type: String }],
    hashtags: [{ type: String }],
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', default: null },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Utilisateurs ayant liké
    reposts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Utilisateurs ayant reposté
    signets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Utilisateurs ayant mis en signet
    likesCount: { type: Number, default: 0 },
    repostsCount: { type: Number, default: 0 },
    signetsCount: { type: Number, default: 0 }, // Nombre de signets
    commentsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Post', PostSchema);
