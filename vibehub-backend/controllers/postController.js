const Post = require('../models/Post');
const Like = require('../models/Like');
const Repost = require('../models/Repost');

exports.createPost = async (req, res) => {
    try {
        const { content, media, hashtags, parentId } = req.body;
        const userId = req.userId;

        const flaskResponse = await fetch("http://127.0.0.1:5001/moderate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content }),
        });

        const flaskData = await flaskResponse.json();
        console.log(flaskData);
        if (flaskData.IsToxic === true) {
            return res.status(400).json({ message: "Contenu inapproprié" });
        }
        const newPost = new Post({
            userId,
            content,
            media,
            hashtags,
            parentId // Peut être null (post principal) ou l'ID d'un post parent (commentaire)
        });

        await newPost.save();

        // Si c'est un commentaire, mettre à jour le compteur de commentaires du post parent
        if (parentId) {
            await Post.findByIdAndUpdate(parentId, { $inc: { commentsCount: 1 } });
        }

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
        const { content, media, hashtags } = req.body;
        const userId = req.user.id;
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        if (post.userId.toString() !== userId) {
            return res.status(403).json({ message: "Non autorisé à modifier ce post" });
        }

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.id,
            { content, media, hashtags },
            { new: true }
        );

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

        // Si c'est un commentaire, décrémenter le compteur du post parent
        if (post.parentId) {
            await Post.findByIdAndUpdate(post.parentId, { $inc: { commentsCount: -1 } });
        }

        // Supprimer tous les commentaires associés à ce post si c'est un post principal
        if (!post.parentId) {
            await Post.deleteMany({ parentId: req.params.id });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du post", error });
    }
};

exports.getPostComments = async (req, res) => {
    try {
        const comments = await Post.find({ parentId: req.params.id })
            .populate('userId', 'username profilePicture')
            .sort({ createdAt: -1 });
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