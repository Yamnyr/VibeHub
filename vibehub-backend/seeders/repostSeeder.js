const Repost = require('../models/Repost');
const Post = require('../models/Post');

// Fonction pour générer des reposts aléatoires avec commentaires
const generateReposts = (users, posts, count = 80) => {
    const reposts = [];
    const repostMap = new Map(); // Pour éviter les doublons

    // Commentaires possibles pour les reposts
    const repostComments = [
        "Je partage ça avec vous !",
        "Très intéressant, à lire absolument.",
        "Qu'en pensez-vous ?",
        "Totalement d'accord avec ce post !",
        "Ceci mérite d'être partagé.",
        "Une information importante à connaître.",
        "Je soutiens ce message.",
        "Regardez ce que j'ai trouvé !",
        "Un point de vue intéressant.",
        "À méditer...",
        "" // Certains reposts n'auront pas de commentaire
    ];

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomPost = posts[Math.floor(Math.random() * posts.length)];

        // Décider si on ajoute un commentaire (70% de chance)
        const hasComment = Math.random() < 0.7;
        const randomComment = hasComment
            ? repostComments[Math.floor(Math.random() * (repostComments.length - 1))]
            : "";

        // Créer une clé unique pour éviter les doublons
        const repostKey = `${randomUser._id}-${randomPost._id}`;

        // Vérifier si ce repost existe déjà et que l'utilisateur ne reposte pas son propre post
        if (!repostMap.has(repostKey) && randomUser._id.toString() !== randomPost.userId.toString()) {
            reposts.push({
                userId: randomUser._id,
                postId: randomPost._id,
                comment: randomComment
            });

            repostMap.set(repostKey, true);
        }
    }

    return reposts;
};

// Fonction pour créer les reposts
const seed = async (users, posts) => {
    try {
        // Supprimer tous les reposts existants
        await Repost.deleteMany({});

        // Générer des reposts aléatoires avec commentaires
        const repostsData = generateReposts(users, posts);

        // Insérer les reposts dans la base de données
        const createdReposts = await Repost.insertMany(repostsData);

        // Mettre à jour le nombre de reposts pour chaque post
        for (const post of posts) {
            const repostCount = await Repost.countDocuments({ postId: post._id });
            await Post.findByIdAndUpdate(post._id, { repostsCount: repostCount });
        }

        return createdReposts;
    } catch (error) {
        console.error('Erreur lors de la création des reposts:', error);
        throw error;
    }
};

module.exports = { seed };