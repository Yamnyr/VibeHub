const Post = require('../models/Post'); // Import the Post model
const mongoose = require('mongoose');

// Obtenir les hashtags tendance
exports.getTrendingHashtags = async (req, res) => {
    try {
        // Retrieve all Posts, grouped by hashtags, and count their occurrences
        const hashtags = await Post.aggregate([
            { $unwind: "$hashtags" },  // Unwind the hashtags array
            { $group: { _id: "$hashtags", count: { $sum: 1 } } }, // Group by hashtag and count occurrences
            { $sort: { count: -1 } }, // Sort by count in descending order (most popular first)
            { $limit: 10 } // Limit to top 10 trending hashtags
        ]);

        // Extract only the hashtags from the result
        const trendingHashtags = hashtags.map(item => item._id);

        res.status(200).json(trendingHashtags);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des hashtags tendance' });
    }
};

// Obtenir tous les Posts avec un hashtag spécifique
exports.getPostsByHashtag = async (req, res) => {
    try {
        const hashtag = req.params.hashtag;

        // Find all Posts that contain the specified hashtag
        const Posts = await Post.find({ hashtags: hashtag })
            .sort({ createdAt: -1 })  // Sort by newest first
            .populate('userId', 'username profileImage');  // Populate user details (optional)

        if (Posts.length === 0) {
            return res.status(404).json({ message: 'Aucun Post trouvé pour ce hashtag' });
        }

        res.status(200).json(Posts);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des Posts avec ce hashtag' });
    }
};
