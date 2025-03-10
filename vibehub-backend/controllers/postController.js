const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Like = require('../models/Like');
const Repost = require('../models/Repost');

exports.createPost = async (req, res) => {
    try {
        const { userId, content, media, hashtags } = req.body;
        const newPost = new Post({ userId, content, media, hashtags });
        await newPost.save();
        res.status(201).json({ message: "Post créé avec succès", post: newPost });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création du post", error });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture');
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du post", error });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const { content, media } = req.body;
        const updatedPost = await Post.findByIdAndUpdate(req.params.id, { content, media }, { new: true });

        if (!updatedPost) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        res.status(200).json({ message: "Post mis à jour", post: updatedPost });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du post", error });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post", error });
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const comments = await Comment.find({ postId: req.params.id }).populate('userId', 'username profilePicture');
        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des commentaires", error });
    }
};

exports.getPostLikes = async (req, res) => {
    try {
        const likes = await Like.find({ postId: req.params.id }).populate('userId', 'username profilePicture');
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des likes", error });
    }
};

exports.getPostReposts = async (req, res) => {
    try {
        const reposts = await Repost.find({ postId: req.params.id }).populate('userId', 'username profilePicture');
        res.status(200).json(reposts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des reposts", error });
    }
};
