const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.post('/posts', postController.createPost);
router.get('/posts/:id', postController.getPostById);
router.put('/posts/:id', postController.updatePost);
router.delete('/posts/:id', postController.deletePost);
router.get('/posts/:id/comments', postController.getPostComments);
router.get('/posts/:id/likes', postController.getPostLikes);
router.get('/posts/:id/reposts', postController.getPostReposts);

module.exports = router;
