const express = require('express');
const searchController = require('../controllers/searchController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes pour la recherche
router.get('/search/tweets', searchController.searchTweets); // Recherche des tweets
router.get('/search/users', searchController.searchUsers); // Recherche des utilisateurs
router.get('/search/hashtags', searchController.searchHashtags); // Recherche des hashtags

module.exports = router;
