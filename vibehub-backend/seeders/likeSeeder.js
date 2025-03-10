const Like = require('../models/Like');
const Post = require('../models/Post');

// Fonction pour générer des likes aléatoires
const generateLikes = (users, posts, count = 150) => {
    const likes = [];
    const likeMap = new Map(); // Pour éviter les doublons

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        // Créer une clé unique pour éviter les doublons
        const likeKey = `${randomUser._id}-${randomPost._id}`;

        // Vérifier si ce like existe déjà
        if (!likeMap.has(likeKey)) {
            likes.push({
                userId: randomUser._id,
                postId: randomPost._id
            });

            likeMap.set(likeKey, true);
        }
    }

    return likes;
};

// Fonction pour créer les likes
const seed = async (users, posts) => {
    try {
        // Supprimer tous les likes existants
        await Like.deleteMany({});

        // Générer des likes aléatoires
        const likesData = generateLikes(users, posts);

        // Insérer les likes dans la base de données
        const createdLikes = await Like.insertMany(likesData);

        // Mettre à jour le nombre de likes pour chaque post
        for (const post of posts) {
            const likeCount = await Like.countDocuments({ postId: post._id });
            await Post.findByIdAndUpdate(post._id, { likesCount: likeCount });
        }

        return createdLikes;
    } catch (error) {
        console.error('Erreur lors de la création des likes:', error);
        throw error;
    }
};

module.exports = { seed };