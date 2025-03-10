const HashtagSchema = new mongoose.Schema({
    hashtag: { type: String, required: true, unique: true },
    tweetsCount: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Hashtag', HashtagSchema);
