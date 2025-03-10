const express = require('express');
const router = express.Router();
const repostController = require('../controllers/repostController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts/:id/repost', authMiddleware, repostController.repostPost);
router.delete('/posts/:id/repost', authMiddleware, repostController.unrepostPost);
router.get('/users/:id/reposts', authMiddleware, repostController.getUserReposts);

module.exports = router;
