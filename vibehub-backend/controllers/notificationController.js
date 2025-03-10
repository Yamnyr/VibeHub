const Notification = require('../models/Notification');
const User = require('../models/User');

exports.getUserNotifications = async (req, res) => {
    try {
        const { userId } = req.body;
        const notifications = await Notification.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération des notifications", error });
    }
};

exports.markNotificationAsRead = async (req, res) => {
    try {
        const notification = await Notification.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });

        if (!notification) return res.status(404).json({ message: "Notification non trouvée" });

        res.status(200).json({ message: "Notification marquée comme lue", notification });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour de la notification", error });
    }
};

exports.markAllNotificationsAsRead = async (req, res) => {
    try {
        const { userId } = req.body;

        await Notification.updateMany({ userId, isRead: false }, { isRead: true });

        res.status(200).json({ message: "Toutes les notifications ont été marquées comme lues" });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des notifications", error });
    }
};

exports.updateNotificationSettings = async (req, res) => {
    try {
        const { userId, notificationSettings } = req.body;

        const user = await User.findByIdAndUpdate(userId, { notificationSettings }, { new: true });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        res.status(200).json({ message: "Paramètres de notification mis à jour", user });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la mise à jour des paramètres de notification", error });
    }
};
