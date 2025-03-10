const mongoose = require('mongoose');

const RepostSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
    comment: { type: String, default: '' }, // Nouveau champ pour le commentaire
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repost', RepostSchema);