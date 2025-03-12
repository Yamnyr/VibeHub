const User = require('../models/User');
const bcrypt = require('bcryptjs');

// Données de test pour les utilisateurs
const usersData = [
    {
        username: 'johndoe',
        email: 'john@example.com',
        password: 'password123',
        bio: 'Développeur web passionné',
        profilePicture: 'https://randomuser.me/api/portraits/men/1.jpg',
        banner: 'https://picsum.photos/id/1015/1500/500',
    },
    {
        username: 'janedoe',
        email: 'jane@example.com',
        password: 'password123',
        bio: 'Designer UX/UI | Créatrice de contenu',
        profilePicture: 'https://randomuser.me/api/portraits/women/2.jpg',
        banner: 'https://picsum.photos/id/1016/1500/500',
    },
    {
        username: 'techguru',
        email: 'tech@example.com',
        password: 'password123',
        bio: 'Passionné de technologie et d\'innovation',
        profilePicture: 'https://randomuser.me/api/portraits/men/3.jpg',
        banner: 'https://picsum.photos/id/1018/1500/500',
    },
    {
        username: 'traveladdict',
        email: 'travel@example.com',
        password: 'password123',
        bio: 'Voyageuse | Photographe | Blogueuse',
        profilePicture: 'https://randomuser.me/api/portraits/women/4.jpg',
        banner: 'https://picsum.photos/id/1019/1500/500',
    },
    {
        username: 'foodlover',
        email: 'food@example.com',
        password: 'password123',
        bio: 'Chef amateur | Critique culinaire',
        profilePicture: 'https://randomuser.me/api/portraits/men/5.jpg',
        banner: 'https://picsum.photos/id/1080/1500/500',
    }
];

// Fonction pour créer les utilisateurs
const seed = async () => {
    try {
        // Supprimer tous les utilisateurs existants
        await User.deleteMany({});

        // Créer les nouveaux utilisateurs avec des mots de passe hashés
        const hashedUsers = await Promise.all(
            usersData.map(async (user) => {
                const hashedPassword = await bcrypt.hash(user.password, 10);
                return {
                    ...user,
                    password: hashedPassword
                };
            })
        );

        // Insérer les utilisateurs dans la base de données
        const createdUsers = await User.insertMany(hashedUsers);

        // Ajouter des abonnements aléatoires
        createdUsers.forEach(user => {
            let potentialFollowers = createdUsers.filter(u => u._id.toString() !== user._id.toString()); // Exclure lui-même
            let shuffled = potentialFollowers.sort(() => 0.5 - Math.random()); // Mélange aléatoire
            let followers = shuffled.slice(0, 2).map(u => u._id); // Sélectionne 2 abonnés aléatoires

            user.followers = followers;
            user.following = followers; // Suit aussi les mêmes personnes
        });

        // Sauvegarder les modifications
        await Promise.all(createdUsers.map(user => user.save()));

        console.log("✅ Seed des utilisateurs terminé avec followers et following !");
        return createdUsers;
    } catch (error) {
        console.error('❌ Erreur lors de la création des utilisateurs:', error);
        throw error;
    }
};

module.exports = { seed };
