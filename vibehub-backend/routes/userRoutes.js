const express = require('express');
const { register, login, updateProfile } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');  // Middleware pour l'authentification (à créer)

const router = express.Router();

// Route pour l'inscription
router.post('/register', register);

// Route pour la connexion
router.post('/login', login);

// Route pour la mise à jour du profil (nécessite d'être connecté)
router.put('/profile', authMiddleware, updateProfile);

module.exports = router;
