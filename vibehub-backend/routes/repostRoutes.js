const express = require('express');
const router = express.Router();
const repostController = require('../controllers/repostController');

router.post('/posts/:id/retweet', repostController.repostPost);
router.delete('/posts/:id/retweet', repostController.unrepostPost);
router.get('/users/:id/retweets', repostController.getUserReposts);

module.exports = router;
