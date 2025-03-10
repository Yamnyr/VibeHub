const express = require('express');
const hashtagController = require('../controllers/hashtagController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route pour les hashtags tendance
router.get('/hashtags/trending', hashtagController.getTrendingHashtags); // Obtenir les hashtags tendance

// Route pour les posts avec un hashtag spécifique
router.get('/hashtags/:hashtag/posts', hashtagController.getPostsByHashtag); // Obtenir les posts avec un hashtag spécifique

module.exports = router;
