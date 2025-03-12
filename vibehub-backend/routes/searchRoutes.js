const express = require('express');
const router = express.Router();
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');


// Routes pour la recherche
router.get('/search/posts', searchController.searchPosts); // Recherche des posts
router.get('/search/users', searchController.searchUsers); // Recherche des utilisateurs
router.get('/search/hashtags', searchController.searchHashtags); // Recherche des hashtags
router.get('/search', searchController.search); // Recherche avancées
module.exports = router;
