const Post = require('../models/Post'); // Import the Post model
const User = require('../models/User'); // Import the User model

// Fil d'actualité personnalisé
exports.getUserFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Find the list of users the current user follows
        const user = await User.findById(userId).populate('following', '_id');
        const followingIds = user.following.map(u => u._id);

        // Get the latest posts from the users the current user follows
        const posts = await Post.find({ userId: { $in: followingIds } })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités personnalisé' });
    }
};

// Fil d'actualité global
exports.getGlobalFeed = async (req, res) => {
    try {
        // Get the most recent posts from all users
        const posts = await Post.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(posts);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités global' });
    }
};
