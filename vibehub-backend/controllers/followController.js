const Follow = require('../models/Follow');
const User = require('../models/User');

exports.followUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const followId = req.params.id;

        if (userId === followId) return res.status(400).json({ message: "Impossible de se suivre soi-même" });

        const existingFollow = await Follow.findOne({ followerId: userId, followingId: followId });
        if (existingFollow) return res.status(400).json({ message: "Utilisateur déjà suivi" });

        await new Follow({ followerId: userId, followingId: followId }).save();
        await User.findByIdAndUpdate(userId, { $inc: { followingCount: 1 } });
        await User.findByIdAndUpdate(followId, { $inc: { followersCount: 1 } });

        res.status(200).json({ message: "Utilisateur suivi avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du suivi de l'utilisateur", error });
    }
};

exports.unfollowUser = async (req, res) => {
    try {
        const { userId } = req.body;
        const followId = req.params.id;

        const follow = await Follow.findOneAndDelete({ followerId: userId, followingId: followId });
        if (!follow) return res.status(400).json({ message: "L'utilisateur n'est pas suivi" });

        await User.findByIdAndUpdate(userId, { $inc: { followingCount: -1 } });
        await User.findByIdAndUpdate(followId, { $inc: { followersCount: -1 } });

        res.status(200).json({ message: "Utilisateur désabonné avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du désabonnement", error });
    }
};

exports.getUserFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ followingId: req.params.id }).populate('followerId', 'username profilePicture');
        res.status(200).json(followers);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des abonnés", error });
    }
};

exports.getUserFollowing = async (req, res) => {
    try {
        const following = await Follow.find({ followerId: req.params.id }).populate('followingId', 'username profilePicture');
        res.status(200).json(following);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des abonnements", error });
    }
};
