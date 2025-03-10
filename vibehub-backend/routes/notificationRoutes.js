const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

router.get('/notifications', notificationController.getUserNotifications);
router.put('/notifications/:id/read', notificationController.markNotificationAsRead);
router.put('/notifications/read-all', notificationController.markAllNotificationsAsRead);
router.put('/users/notifications/settings', notificationController.updateNotificationSettings);

module.exports = router;
