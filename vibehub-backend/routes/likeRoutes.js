const express = require('express');
const router = express.Router();
const likeController = require('../controllers/likeController');

router.post('/posts/:id/like', likeController.likePost);
router.delete('/posts/:id/like', likeController.unlikePost);
router.get('/users/:id/likes', likeController.getUserLikedPosts);

module.exports = router;
