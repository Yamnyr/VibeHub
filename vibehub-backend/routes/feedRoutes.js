const express = require('express');
const feedController = require('../controllers/feedController');

const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes pour le fil d'actualité
router.get('/feed', authMiddleware, feedController.getUserFeed); // Fil d'actualité personnalisé
router.get('/feed/global', feedController.getGlobalFeed); // Fil d'actualité global



module.exports = router;
