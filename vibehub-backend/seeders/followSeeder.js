const Follow = require('../models/Follow');
const User = require('../models/User');

// Fonction pour générer des abonnements aléatoires
const generateFollows = (users) => {
    const follows = [];
    const followMap = new Map(); // Pour éviter les doublons

    // Chaque utilisateur suit au moins un autre utilisateur
    for (const user of users) {
        // Trouver des utilisateurs à suivre (autres que soi-même)
        const potentialFollowings = users.filter(u => u._id.toString() !== user._id.toString());

        // Nombre aléatoire d'abonnements (1 à 3)
        const followCount = Math.floor(Math.random() * 3) + 1;

        for (let i = 0; i < followCount && i < potentialFollowings.length; i++) {
            const randomIndex = Math.floor(Math.random() * potentialFollowings.length);
            const userToFollow = potentialFollowings[randomIndex];

            // Créer une clé unique pour éviter les doublons
            const followKey = `${user._id}-${userToFollow._id}`;

            // Vérifier si cet abonnement existe déjà
            if (!followMap.has(followKey) && user._id.toString() !== userToFollow._id.toString()) {
                follows.push({
                    followerId: user._id,
                    followingId: userToFollow._id
                });

                followMap.set(followKey, true);

                // Retirer l'utilisateur suivi des potentiels suivis pour éviter les doublons
                potentialFollowings.splice(randomIndex, 1);
            }
        }
    }

    return follows;
};

// Fonction pour créer les abonnements
const seed = async (users) => {
    try {
        // Supprimer tous les abonnements existants
        await Follow.deleteMany({});

        // Générer des abonnements aléatoires
        const followsData = generateFollows(users);

        // Insérer les abonnements dans la base de données
        const createdFollows = await Follow.insertMany(followsData);

        // Mettre à jour le nombre d'abonnés et d'abonnements pour chaque utilisateur
        for (const user of users) {
            const followersCount = await Follow.countDocuments({ followingId: user._id });
            const followingCount = await Follow.countDocuments({ followerId: user._id });

            await User.findByIdAndUpdate(user._id, { followersCount, followingCount });
        }

        return createdFollows;
    } catch (error) {
        console.error('Erreur lors de la création des abonnements:', error);
        throw error;
    }
};

module.exports = { seed };