const Comment = require('../models/Comment');
const Like = require('../models/Like');

exports.addComment = async (req, res) => {
    try {
        const { userId, content } = req.body;
        const postId = req.params.id;

        const newComment = new Comment({ userId, postId, content });
        await newComment.save();

        res.status(201).json({ message: "Commentaire ajouté avec succès", comment: newComment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de l'ajout du commentaire", error });
    }
};

exports.getCommentById = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id).populate('userId', 'username profilePicture');
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });
        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération du commentaire", error });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const updatedComment = await Comment.findByIdAndUpdate(req.params.id, { content }, { new: true });

        if (!updatedComment) return res.status(404).json({ message: "Commentaire non trouvé" });

        res.status(200).json({ message: "Commentaire mis à jour", comment: updatedComment });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour du commentaire", error });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) return res.status(404).json({ message: "Commentaire non trouvé" });

        await Comment.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Commentaire supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du commentaire", error });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const { userId } = req.body;
        const commentId = req.params.id;

        const existingLike = await Like.findOne({ userId, postId: commentId });
        if (existingLike) return res.status(400).json({ message: "Commentaire déjà liké" });

        await new Like({ userId, postId: commentId }).save();
        await Comment.findByIdAndUpdate(commentId, { $inc: { likesCount: 1 } });

        res.status(200).json({ message: "Commentaire liké avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du like du commentaire", error });
    }
};
