const Hashtag = require('../models/Hashtag');
const Post = require('../models/Post');

// Fonction pour extraire et compter les hashtags des posts
const extractHashtags = (posts) => {
    const hashtagCounts = new Map();

    // Parcourir tous les posts pour extraire les hashtags
    for (const post of posts) {
        if (post.hashtags && post.hashtags.length > 0) {
            for (const hashtag of post.hashtags) {
                // Incrémenter le compteur pour ce hashtag
                const count = hashtagCounts.get(hashtag) || 0;
                hashtagCounts.set(hashtag, count + 1);
            }
        }
    }

    // Convertir la Map en tableau d'objets
    const hashtags = [];
    hashtagCounts.forEach((count, hashtag) => {
        hashtags.push({
            hashtag,
            postsCount: count,
            createdAt: new Date()
        });
    });

    return hashtags;
};

// Fonction pour créer les hashtags
const seed = async (posts) => {
    try {
        // Supprimer tous les hashtags existants
        await Hashtag.deleteMany({});

        // Extraire les hashtags des posts
        const hashtagsData = extractHashtags(posts);

        // Insérer les hashtags dans la base de données
        const createdHashtags = await Hashtag.insertMany(hashtagsData);

        return createdHashtags;
    } catch (error) {
        console.error('Erreur lors de la création des hashtags:', error);
        throw error;
    }
};

module.exports = { seed };