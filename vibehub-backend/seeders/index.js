const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userSeeder = require('./userSeeder');
const postSeeder = require('./postSeeder');
const commentSeeder = require('./commentSeeder');
const likeSeeder = require('./likeSeeder');
const followSeeder = require('./followSeeder');
const repostSeeder = require('./repostSeeder');
const signetSeeder = require('./signetSeeder');
const hashtagSeeder = require('./hashtagSeeder');

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

        // 2. Créer les tweets
        const tweets = await postSeeder.seed(users);
        console.log(`✅ ${tweets.length} tweets créés`);

        // 3. Créer les hashtags à partir des tweets
        const hashtags = await hashtagSeeder.seed(tweets);
        console.log(`✅ ${hashtags.length} hashtags créés`);

        // 4. Créer les commentaires sur les tweets
        const comments = await commentSeeder.seed(users, tweets);
        console.log(`✅ ${comments.length} commentaires créés`);

        // 5. Créer les likes sur les tweets
        const likes = await likeSeeder.seed(users, tweets);
        console.log(`✅ ${likes.length} likes créés`);

        // 6. Créer les abonnements entre utilisateurs
        const follows = await followSeeder.seed(users);
        console.log(`✅ ${follows.length} abonnements créés`);

        // 7. Créer les retweets
        const retweets = await repostSeeder.seed(users, tweets);
        console.log(`✅ ${retweets.length} retweets créés`);

        // 8. Créer les signets
        const signets = await signetSeeder.seed(users, tweets);
        console.log(`✅ ${signets.length} signets créés`);

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