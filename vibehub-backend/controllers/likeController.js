const Like = require('../models/Like');
const Post = require('../models/Post');

exports.likePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const existingLike = await Like.findOne({ userId, postId });
        if (existingLike) return res.status(400).json({ message: "Post déjà liké" });

        await new Like({ userId, postId }).save();
        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: 1 } });

        res.status(200).json({ message: "Post liké avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du like du post", error });
    }
};

exports.unlikePost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const like = await Like.findOneAndDelete({ userId, postId });
        if (!like) return res.status(400).json({ message: "Like non trouvé" });

        await Post.findByIdAndUpdate(postId, { $inc: { likesCount: -1 } });

        res.status(200).json({ message: "Like retiré" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du retrait du like", error });
    }
};

exports.getUserLikedPosts = async (req, res) => {
    try {
        const likes = await Like.find({ userId: req.userId }).populate('postId');
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des posts likés", error });
    }
};
