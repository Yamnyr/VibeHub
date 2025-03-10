const Comment = require('../models/Comment');
const Post = require('../models/Post');

// Fonction pour générer des commentaires aléatoires
const generateComments = (users, posts, count = 100) => {
    const comments = [];

    const commentContents = [
        "Super post, merci pour le partage !",
        "Je suis totalement d'accord avec toi.",
        "Intéressant, j'aimerais en savoir plus.",
        "Pas mal, mais as-tu pensé à...",
        "C'est exactement ce dont j'avais besoin !",
        "Je ne suis pas sûr de comprendre, peux-tu expliquer davantage ?",
        "Excellent point de vue !",
        "J'ai eu la même expérience récemment.",
        "Merci pour ces informations utiles.",
        "Je vais essayer ça dès que possible."
    ];

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];
        const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];

        comments.push({
            userId: randomUser._id,
            postId: randomPost._id,
            content: randomContent,
            likesCount: 0
        });
    }

    return comments;
};

// Fonction pour créer les commentaires
const seed = async (users, posts) => {
    try {
        // Supprimer tous les commentaires existants
        await Comment.deleteMany({});

        // Générer des commentaires aléatoires
        const commentsData = generateComments(users, posts);

        // Insérer les commentaires dans la base de données
        const createdComments = await Comment.insertMany(commentsData);

        // Mettre à jour le nombre de commentaires pour chaque post
        for (const post of posts) {
            const commentCount = await Comment.countDocuments({ postId: post._id });
            await Post.findByIdAndUpdate(post._id, { commentsCount: commentCount });
        }

        return createdComments;
    } catch (error) {
        console.error('Erreur lors de la création des commentaires:', error);
        throw error;
    }
};

module.exports = { seed };