const express = require('express');
const signetController = require('../controllers/signetController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Routes protégées (nécessitent une authentification)
router.post('/:id/signet', authMiddleware, signetController.addToSignets); // Enregistrer un post
router.delete('/:id/signet', authMiddleware, signetController.removeFromSignets); // Retirer un post des signets
router.get('/signets', authMiddleware, signetController.getUserSignets); // Obtenir tous les posts enregistrés par l'utilisateur connecté

module.exports = router;
