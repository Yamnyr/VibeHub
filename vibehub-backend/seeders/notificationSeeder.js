const Notification = require('../models/Notification');
const Like = require('../models/Like');
const Repost = require('../models/Repost');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');
const User = require('../models/User');
const Post = require('../models/Post');

// Fonction pour générer des notifications basées sur les interactions existantes
const generateNotifications = async (users) => {
    const notifications = [];

    try {
        // 1. Notifications pour les likes
        const likes = await Like.find()
            .populate('userId', 'username')
            .populate({
                path: 'postId',
                select: 'userId',
                populate: { path: 'userId', select: 'username' }
            });

        for (const like of likes) {
            // Ne pas créer de notification si l'utilisateur like son propre post
            if (like.userId._id.toString() !== like.postId.userId._id.toString()) {
                notifications.push({
                    userId: like.postId.userId._id, // L'utilisateur qui reçoit la notification (auteur du post)
                    type: 'like',
                    message: `${like.userId.username} a aimé votre post`,
                    isRead: Math.random() > 0.7, // 30% de chance d'être non lu
                    createdAt: like.createdAt
                });
            }
        }

        // 2. Notifications pour les reposts
        const reposts = await Repost.find()
            .populate('userId', 'username')
            .populate({
                path: 'postId',
                select: 'userId',
                populate: { path: 'userId', select: 'username' }
            });

        for (const repost of reposts) {
            // Ne pas créer de notification si l'utilisateur reposte son propre post
            if (repost.userId._id.toString() !== repost.postId.userId._id.toString()) {
                notifications.push({
                    userId: repost.postId.userId._id, // L'utilisateur qui reçoit la notification (auteur du post)
                    type: 'repost',
                    message: `${repost.userId.username} a reposté votre post`,
                    isRead: Math.random() > 0.7, // 30% de chance d'être non lu
                    createdAt: repost.createdAt
                });
            }
        }

        // 3. Notifications pour les commentaires
        const comments = await Comment.find()
            .populate('userId', 'username')
            .populate({
                path: 'postId',
                select: 'userId',
                populate: { path: 'userId', select: 'username' }
            });

        for (const comment of comments) {
            // Ne pas créer de notification si l'utilisateur commente son propre post
            if (comment.userId._id.toString() !== comment.postId.userId._id.toString()) {
                notifications.push({
                    userId: comment.postId.userId._id, // L'utilisateur qui reçoit la notification (auteur du post)
                    type: 'comment',
                    message: `${comment.userId.username} a commenté votre post`,
                    isRead: Math.random() > 0.7, // 30% de chance d'être non lu
                    createdAt: comment.createdAt
                });
            }
        }

        // 4. Notifications pour les abonnements
        const follows = await Follow.find()
            .populate('followerId', 'username')
            .populate('followingId', 'username');

        for (const follow of follows) {
            notifications.push({
                userId: follow.followingId._id, // L'utilisateur qui reçoit la notification (celui qui est suivi)
                type: 'follow',
                message: `${follow.followerId.username} a commencé à vous suivre`,
                isRead: Math.random() > 0.7, // 30% de chance d'être non lu
                createdAt: follow.createdAt
            });
        }

        return notifications;
    } catch (error) {
        console.error('Erreur lors de la génération des notifications:', error);
        throw error;
    }
};

// Fonction pour créer les notifications
const seed = async (users) => {
    try {
        // Supprimer toutes les notifications existantes
        await Notification.deleteMany({});

        // Générer des notifications basées sur les interactions existantes
        const notificationsData = await generateNotifications(users);

        // Insérer les notifications dans la base de données
        const createdNotifications = await Notification.insertMany(notificationsData);

        return createdNotifications;
    } catch (error) {
        console.error('Erreur lors de la création des notifications:', error);
        throw error;
    }
};

module.exports = { seed };