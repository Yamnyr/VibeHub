const Signet = require('../models/Signet'); // Import the Signet model

// Enregistrer un post dans les signets
exports.addToSignets = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // UserId is extracted from the decoded JWT

        // Vérifier si le post est déjà enregistré dans les signets
        const existingSignet = await Signet.findOne({ postId, userId });
        if (existingSignet) {
            return res.status(400).json({ error: 'Ce post est déjà dans vos signets' });
        }

        // Créer un nouveau signet
        const newSignet = new Signet({
            userId,
            postId
        });

        await newSignet.save();
        res.status(201).json({ message: 'post ajouté aux signets avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout du post aux signets' });
    }
};

// Retirer un post des signets
exports.removeFromSignets = async (req, res) => {
    try {
        const postId = req.params.id;
        const userId = req.userId; // UserId from the JWT

        // Trouver et supprimer le signet
        const signet = await Signet.findOneAndDelete({ postId, userId });
        if (!signet) {
            return res.status(404).json({ error: 'post non trouvé dans vos signets' });
        }

        res.status(200).json({ message: 'post retiré des signets avec succès' });
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors du retrait du post des signets' });
    }
};

// Obtenir tous les signets de l'utilisateur connecté
exports.getUserSignets = async (req, res) => {
    try {
        const userId = req.userId; // UserId from the JWT

        // Récupérer tous les signets de l'utilisateur
        const signets = await Signet.find({ userId }).populate('postId', 'content userId').exec();

        if (!signets || signets.length === 0) {
            return res.status(404).json({ message: 'Aucun post trouvé dans vos signets' });
        }

        res.status(200).json(signets);
    } catch (err) {
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération des signets' });
    }
};
