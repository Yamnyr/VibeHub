const Repost = require('../models/Repost');
const Post = require('../models/Post');

exports.repostPost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const existingRepost = await Repost.findOne({ userId, postId: postId });
        if (existingRepost) return res.status(400).json({ message: "Post déjà reposté" });

        await new Repost({ userId, postId: postId }).save();
        await Post.findByIdAndUpdate(postId, { $inc: { repostsCount: 1 } });

        res.status(200).json({ message: "Post reposté avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du repost du post", error });
    }
};

exports.unrepostPost = async (req, res) => {
    try {
        const userId = req.userId;
        const postId = req.params.id;

        const repost = await Repost.findOneAndDelete({ userId, postId: postId });
        if (!repost) return res.status(400).json({ message: "Repost non trouvé" });

        await Post.findByIdAndUpdate(postId, { $inc: { repostsCount: -1 } });

        res.status(200).json({ message: "Repost annulé" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'annulation du repost", error });
    }
};

exports.getUserReposts = async (req, res) => {
    try {
        const reposts = await Repost.find({ userId: req.userId }).populate('postId');
        res.status(200).json(reposts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des reposts", error });
    }
};
