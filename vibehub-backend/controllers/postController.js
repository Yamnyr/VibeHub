const Post = require('../models/Post');
const io = require('../utils/socket'); // Chemin vers votre configuration Socket.IO


exports.createPost = async (req, res) => {
    try {
        const { content, hashtags, parentId } = req.body;
        const userId = req.userId;
        const media = req.files.map(file => `assets/uploads/${file.filename}`); // Générer les URLs des fichiers
        const flaskResponse = await fetch("http://vibehub-ia:5001/moderate", {
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
            parentId
        });

        await newPost.save();

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
        const userId = req.userId;
        const post = await Post.findById(req.params.id).populate('userId', 'username profilePicture').lean();

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        post.isLiked = post.likes.some(like => like.toString() === userId.toString()); // Vérifie si l'utilisateur a liké le post
        post.isReposted = post.reposts.some(repost => repost.toString() === userId.toString()); // Vérifie si l'utilisateur a reposté le post

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
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        const likes = post.likes; // Tableau des utilisateurs ayant liké
        res.status(200).json(likes);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des likes", error });
    }
};

exports.getPostReposts = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }
        const reposts = post.reposts; // Tableau des utilisateurs ayant reposté
        res.status(200).json(reposts);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des reposts", error });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post = await Post.findById(postId).populate("userId", "username");

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        let isLiked;
        if (post.likes.includes(userId)) {
            post.likes.pull(userId); // Retirer le like
            isLiked = false;
        } else {
            post.likes.push(userId); // Ajouter le like
            isLiked = true;

            // Ajouter une notification
            const notification = {
                userId: post.userId._id,
                type: "like",
                message: `${req.user.username} a aimé votre post`,
                isRead: false,
                createdAt: new Date(),
            };

            await Notification.create(notification);

            // Émettre la notification en temps réel
            io.emit("receive-notification", notification);
        }

        // Mettre à jour le compteur de likes
        post.likesCount = post.likes.length;
        await post.save();

        res.status(200).json({ message: "Likes mis à jour", isLiked, post });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du toggle du favori", error });
    }
};

exports.toggleRepost = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post = await Post.findById(postId).populate("userId", "username");

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        let isReposted;
        if (post.reposts.includes(userId)) {
            post.reposts.pull(userId); // Retirer le repost
            isReposted = false;
        } else {
            post.reposts.push(userId); // Ajouter le repost
            isReposted = true;

            // Ajouter une notification
            const notification = {
                userId: post.userId._id,
                type: "repost",
                message: `${req.user.username} a reposté votre post`,
                isRead: false,
                createdAt: new Date(),
            };

            await Notification.create(notification);

            // Émettre la notification en temps réel
            io.emit("receive-notification", notification);
        }

        // Mettre à jour le compteur de reposts
        post.repostsCount = post.reposts.length;
        await post.save();

        res.status(200).json({ message: "Repost mis à jour", isReposted, post });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du repost", error });
    }
};


exports.toggleSignet = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        // Ajouter ou retirer le signet
        if (post.signets.includes(userId)) {
            post.signets.pull(userId); // Si déjà en signet, retirer
        } else {
            post.signets.push(userId); // Sinon, ajouter en signet
        }

        // Mettre à jour le compteur de signets
        post.signetsCount = post.signets.length;
        await post.save();

        res.status(200).json({ message: "Signet mis à jour", post });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors du toggle du signet", error });
    }
};

exports.getPostSignets = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('signets', 'username profilePicture');

        if (!post) {
            return res.status(404).json({ message: "Post non trouvé" });
        }

        res.status(200).json(post.signets); // Renvoie les utilisateurs ayant ajouté le post en signet
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des signets", error });
    }
};