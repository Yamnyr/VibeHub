const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ error: 'Accès refusé, vous devez vous connecter' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decoded.userId; // Ajouter l'ID de l'utilisateur au request
        next(); // Passer au contrôleur suivant
    } catch (err) {
        res.status(400).json({ error: 'Token invalide' });
    }
};

module.exports = authMiddleware;
