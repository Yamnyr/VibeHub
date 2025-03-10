const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.post('/posts/:id/comments', commentController.addComment);
router.get('/comments/:id', commentController.getCommentById);
router.put('/comments/:id', commentController.updateComment);
router.delete('/comments/:id', commentController.deleteComment);
router.post('/comments/:id/like', commentController.likeComment);

module.exports = router;
