const Post = require('../models/Post');

// Fonction pour générer des posts aléatoires
const generatePosts = (users, count = 50) => {
    const posts = [];
    const hashtags = ['#javascript', '#nodejs', '#mongodb', '#reactjs', '#webdev', '#coding', '#programming', '#tech', '#innovation', '#design'];
    const mediaUrls = [
        'https://picsum.photos/id/1/800/600',
        'https://picsum.photos/id/20/800/600',
        'https://picsum.photos/id/30/800/600',
        'https://picsum.photos/id/40/800/600',
        'https://picsum.photos/id/50/800/600'
    ];

    const contents = [
        "Je viens de découvrir une nouvelle technologie incroyable !",
        "Voici mon dernier projet, n'hésitez pas à me donner votre avis.",
        "Qui serait intéressé par un meetup tech la semaine prochaine ?",
        "Je cherche des recommandations pour un bon framework CSS. Des idées ?",
        "Je viens de publier un nouvel article sur mon blog, lien en bio !",
        "Cette conférence était vraiment inspirante, j'ai hâte d'appliquer ce que j'ai appris.",
        "Quelqu'un a-t-il déjà utilisé cette nouvelle API ?",
        "Je suis en train de refactoriser mon code, c'est tellement satisfaisant !",
        "Journée productive aujourd'hui, j'ai enfin résolu ce bug qui me tracassait.",
        "Je viens de mettre à jour mon portfolio, qu'en pensez-vous ?"
    ];

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];
        const randomContent = contents[Math.floor(Math.random() * contents.length)];
        const randomHashtagCount = Math.floor(Math.random() * 3) + 1; // 1 à 3 hashtags
        const selectedHashtags = [];

        // Sélectionner des hashtags aléatoires
        for (let j = 0; j < randomHashtagCount; j++) {
            const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
            if (!selectedHashtags.includes(randomHashtag)) {
                selectedHashtags.push(randomHashtag);
            }
        }

        // Décider si le post a des médias
        const hasMedia = Math.random() > 0.7; // 30% de chance d'avoir des médias
        const media = hasMedia ? [mediaUrls[Math.floor(Math.random() * mediaUrls.length)]] : [];

        posts.push({
            userId: randomUser._id,
            content: `${randomContent} ${selectedHashtags.join(' ')}`,
            media,
            hashtags: selectedHashtags.map(tag => tag.substring(1)), // Enlever le # pour stocker
            likesCount: 0,
            repostsCount: 0,
            commentsCount: 0
        });
    }

    return posts;
};

// Fonction pour créer les posts
const seed = async (users) => {
    try {
        // Supprimer tous les posts existants
        await Post.deleteMany({});

        // Générer des posts aléatoires
        const postsData = generatePosts(users);

        // Insérer les posts dans la base de données
        const createdPosts = await Post.insertMany(postsData);

        return createdPosts;
    } catch (error) {
        console.error('Erreur lors de la création des posts:', error);
        throw error;
    }
};

module.exports = { seed };