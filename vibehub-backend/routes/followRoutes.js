const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/users/:id/follow', authMiddleware, followController.followUser);
router.delete('/users/:id/follow', authMiddleware, followController.unfollowUser);
router.get('/users/:id/followers', authMiddleware, followController.getUserFollowers);
router.get('/users/:id/following', authMiddleware, followController.getUserFollowing);

module.exports = router;
