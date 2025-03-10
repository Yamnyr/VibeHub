const Tweet = require('../models/Tweet'); // Import the Tweet model
const User = require('../models/User'); // Import the User model

// Fil d'actualité personnalisé
exports.getUserFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Find the list of users the current user follows
        const user = await User.findById(userId).populate('following', '_id');
        const followingIds = user.following.map(u => u._id);

        // Get the latest tweets from the users the current user follows
        const tweets = await Tweet.find({ userId: { $in: followingIds } })
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités personnalisé' });
    }
};

// Fil d'actualité global
exports.getGlobalFeed = async (req, res) => {
    try {
        // Get the most recent tweets from all users
        const tweets = await Tweet.find()
            .sort({ createdAt: -1 }) // Sort by newest first
            .populate('userId', 'username profileImage'); // Populate user details

        res.status(200).json(tweets);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités global' });
    }
};
