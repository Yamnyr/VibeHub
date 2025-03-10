const Signet = require('../models/Signet');

// Fonction pour générer des signets aléatoires
const generateSignets = (users, posts, count = 60) => {
    const signets = [];
    const signetMap = new Map(); // Pour éviter les doublons

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        // Créer une clé unique pour éviter les doublons
        const signetKey = `${randomUser._id}-${randomPost._id}`;

        // Vérifier si ce signet existe déjà
        if (!signetMap.has(signetKey)) {
            signets.push({
                userId: randomUser._id,
                postId: randomPost._id
            });

            signetMap.set(signetKey, true);
        }
    }

    return signets;
};

// Fonction pour créer les signets
const seed = async (users, posts) => {
    try {
        // Supprimer tous les signets existants
        await Signet.deleteMany({});

        // Générer des signets aléatoires
        const signetsData = generateSignets(users, posts);

        // Insérer les signets dans la base de données
        const createdSignets = await Signet.insertMany(signetsData);

        return createdSignets;
    } catch (error) {
        console.error('Erreur lors de la création des signets:', error);
        throw error;
    }
};

module.exports = { seed };