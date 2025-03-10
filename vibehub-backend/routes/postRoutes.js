const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts', authMiddleware, postController.createPost);
router.get('/posts/:id', authMiddleware, postController.getPostById);
router.put('/posts/:id', authMiddleware, postController.updatePost);
router.delete('/posts/:id', authMiddleware, postController.deletePost);
router.get('/posts/:id/comments', authMiddleware, postController.getPostComments);
router.get('/posts/:id/likes', authMiddleware, postController.getPostLikes);
router.get('/posts/:id/reposts', authMiddleware, postController.getPostReposts);

module.exports = router;
