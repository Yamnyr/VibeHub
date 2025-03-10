const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/notifications', authMiddleware, notificationController.getUserNotifications);
router.put('/notifications/:id/read', authMiddleware, notificationController.markNotificationAsRead);
router.put('/notifications/read-all', authMiddleware, notificationController.markAllNotificationsAsRead);
router.put('/users/notifications/settings', authMiddleware, notificationController.updateNotificationSettings);

module.exports = router;
