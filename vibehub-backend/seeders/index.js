const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userSeeder = require('./userSeeder');
const postSeeder = require('./postSeeder');
const likeSeeder = require('./likeSeeder');
const followSeeder = require('./followSeeder');
const repostSeeder = require('./repostSeeder');
const signetSeeder = require('./signetSeeder');
const hashtagSeeder = require('./hashtagSeeder');
const notificationSeeder = require('./notificationSeeder'); // Nouveau seeder

dotenv.config();

// Fonction pour exécuter tous les seeders
const seedDatabase = async () => {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connecté à MongoDB pour le seeding');

        // Exécution des seeders dans l'ordre
        console.log('Début du seeding...');

        // 1. Créer les utilisateurs en premier
        const users = await userSeeder.seed();
        console.log(`✅ ${users.length} utilisateurs créés`);

        // 2. Créer les posts
        const posts = await postSeeder.seed(users);
        console.log(`✅ ${posts.length} posts créés`);

        // 3. Créer les hashtags à partir des posts
        const hashtags = await hashtagSeeder.seed(posts);
        console.log(`✅ ${hashtags.length} hashtags créés`);

        // 5. Créer les likes sur les posts
        const likes = await likeSeeder.seed(users, posts);
        console.log(`✅ ${likes.length} likes créés`);

        // 6. Créer les abonnements entre utilisateurs
        const follows = await followSeeder.seed(users);
        console.log(`✅ ${follows.length} abonnements créés`);

        // 7. Créer les reposts
        const reposts = await repostSeeder.seed(users, posts);
        console.log(`✅ ${reposts.length} reposts créés`);

        // 8. Créer les signets
        const signets = await signetSeeder.seed(users, posts);
        console.log(`✅ ${signets.length} signets créés`);

        // 9. Créer les notifications basées sur les interactions
        const notifications = await notificationSeeder.seed(users);
        console.log(`✅ ${notifications.length} notifications créées`);

        console.log('✅ Seeding terminé avec succès!');

        // Déconnexion de MongoDB
        await mongoose.disconnect();
        console.log('Déconnecté de MongoDB');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors du seeding:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

// Exécuter le seeding
seedDatabase();