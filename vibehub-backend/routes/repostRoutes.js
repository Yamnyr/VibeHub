const express = require('express');
const router = express.Router();
const repostController = require('../controllers/repostController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/posts/:id/retweet', authMiddleware, repostController.repostPost);
router.delete('/posts/:id/retweet', authMiddleware, repostController.unrepostPost);
router.get('/users/:id/retweets', authMiddleware, repostController.getUserReposts);

module.exports = router;
