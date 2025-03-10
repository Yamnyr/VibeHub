const express = require('express');
const router = express.Router();
const followController = require('../controllers/followController');

router.post('/users/:id/follow', followController.followUser);
router.delete('/users/:id/follow', followController.unfollowUser);
router.get('/users/:id/followers', followController.getUserFollowers);
router.get('/users/:id/following', followController.getUserFollowing);

module.exports = router;
