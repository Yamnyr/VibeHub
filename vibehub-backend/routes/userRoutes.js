const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware')

const router = express.Router();

// Routes publiques
router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/profile/:username', userController.getUserByUsername);
router.get('/:id', userController.getUserById);
router.get('/:id/posts', userController.getUserPosts);
router.get('/:id/followers', userController.getFollowers);
router.get('/:id/following', userController.getFollowing);

// Routes protégées (nécessitent une authentification)
router.get('/me', authMiddleware, userController.getCurrentUser);
router.put('/profile', authMiddleware, upload.array("profilePicture", 1), userController.updateProfile);
// router.get('/signets', authMiddleware, userController.getUserSignets);
// router.post('/:id/follow', authMiddleware, userController.followUser);
// router.delete('/:id/follow', authMiddleware, userController.unfollowUser);
// router.get('/:id/reposts', authMiddleware, userController.getUserPosts);
// router.get('/search', authMiddleware, userController.searchUsers);

router.post('/:id/toggle-follow', authMiddleware, userController.toggleFollow); // Nouvelle route


module.exports = router;