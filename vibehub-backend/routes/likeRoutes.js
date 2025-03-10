const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts/:id/like', authMiddleware, likeController.likePost);
router.delete('/posts/:id/like', authMiddleware, likeController.unlikePost);
router.get('/users/:id/likes', authMiddleware, likeController.getUserLikedPosts);

module.exports = router;
