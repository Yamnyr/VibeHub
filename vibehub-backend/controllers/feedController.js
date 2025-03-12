const Post = require("../models/Post");
const User = require("../models/User");

exports.getUserFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Récupérer l'utilisateur et ses abonnements (following)
        const user = await User.findById(userId).populate('following', '_id');
        const followingIds = user.following.map(u => u._id);

        // Récupérer les posts des utilisateurs suivis
        const posts = await Post.find({
            userId: { $in: followingIds },
            $or: [
                { parentId: null },
                { parentId: { $exists: false } }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profileImage')
            .lean(); // Utilisation de lean() pour travailler avec des objets JavaScript simples

        // Ajouter si l'utilisateur a liké ou reposté le post
        posts.forEach(post => {
            post.isLiked = post.likes.some(like => like.toString() === userId.toString()); // Vérifie si l'utilisateur a liké le post
            post.isReposted = post.reposts.some(repost => repost.toString() === userId.toString()); // Vérifie si l'utilisateur a reposté le post
            post.isSigneted = post.signets.some(signet => signet.toString() === userId.toString());
        });

        res.status(200).json(posts);
    } catch (err) {
        console.error('Erreur feed utilisateur:', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités personnalisé' });
    }
};

exports.getGlobalFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Récupérer tous les posts récents de tous les utilisateurs
        const posts = await Post.find({
            $or: [
                { parentId: null },
                { parentId: { $exists: false } }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture')
            .lean(); // Utilisation de lean() pour travailler avec des objets JavaScript simples

        // Ajouter si l'utilisateur a liké ou reposté le post
        posts.forEach(post => {
            post.isLiked = post.likes.some(like => like.toString() === userId.toString()); // Vérifie si l'utilisateur a liké le post
            post.isReposted = post.reposts.some(repost => repost.toString() === userId.toString()); // Vérifie si l'utilisateur a reposté le post
            post.isSigneted = post.signets.some(signet => signet.toString() === userId.toString());
        });

        res.status(200).json(posts);
    } catch (err) {
        console.error('Erreur feed global:', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités global' });
    }
};
