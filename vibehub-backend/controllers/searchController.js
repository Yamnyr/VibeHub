const Post = require('../models/Post'); // Import the Post model
const User = require('../models/User'); // Import the User model

// Recherche des posts par mots-clés
exports.searchPosts = async (req, res) => {
    try {
        const query = req.query.query || '';
        
        // Find posts where the content matches the query
        const posts = await Post.find({ content: { $regex: query, $options: 'i' } })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de posts' });
    }
};

// Recherche des utilisateurs
exports.searchUsers = async (req, res) => {
    try {
        const query = req.query.query || '';
        
        // Find users whose username matches the query
        const users = await User.find({ username: { $regex: query, $options: 'i' } });

        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la recherche des utilisateurs' });
    }
};

// Recherche des hashtags
exports.searchHashtags = async (req, res) => {
    try {
        const query = req.query.query || '';

        // Find posts where hashtags match the query
        const posts = await Post.find({ hashtags: { $in: [query] } })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la recherche de hashtags' });
    }
};
