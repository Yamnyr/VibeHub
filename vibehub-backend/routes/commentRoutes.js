const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts/:id/comments', authMiddleware, commentController.addComment);
router.get('/comments/:id', authMiddleware, commentController.getCommentById);
router.put('/comments/:id', authMiddleware, commentController.updateComment);
router.delete('/comments/:id', authMiddleware, commentController.deleteComment);
router.post('/comments/:id/like', authMiddleware, commentController.likeComment);

module.exports = router;
