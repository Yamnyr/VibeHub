const Post = require('../models/Post');

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

        // Sélectionner aléatoirement des utilisateurs qui ont liké ou reposté
        const likesCount = Math.floor(Math.random() * users.length);
        const repostsCount = Math.floor(Math.random() * users.length);

        // Générer des utilisateurs aléatoires pour likes et reposts
        const randomLikes = [];
        const randomReposts = [];

        while (randomLikes.length < likesCount) {
            const randomLikeUser = users[Math.floor(Math.random() * users.length)];
            if (!randomLikes.includes(randomLikeUser._id) && randomLikeUser._id !== randomUser._id) {
                randomLikes.push(randomLikeUser._id);
            }
        }

        while (randomReposts.length < repostsCount) {
            const randomRepostUser = users[Math.floor(Math.random() * users.length)];
            if (!randomReposts.includes(randomRepostUser._id) && randomRepostUser._id !== randomUser._id) {
                randomReposts.push(randomRepostUser._id);
            }
        }

        posts.push({
            userId: randomUser._id,
            content: `${randomContent} ${selectedHashtags.join(' ')}`,
            media,
            hashtags: selectedHashtags.map(tag => tag.substring(1)), // Enlever le # pour stocker
            likes: randomLikes, // Les utilisateurs qui ont liké ce post
            reposts: randomReposts, // Les utilisateurs qui ont reposté ce post
            likesCount: randomLikes.length,
            repostsCount: randomReposts.length,
            commentsCount: 0,
            parentId: null // Ces posts sont des posts principaux
        });
    }

    return posts;
};

// Fonction pour générer des commentaires aléatoires pour les posts
const generateComments = (users, posts, commentsPerPost = 5) => {
    const comments = [];
    const commentContents = [
        "Super post ! J'adore ton contenu.",
        "Je suis totalement d'accord avec toi !",
        "Intéressant, peux-tu en dire plus ?",
        "Merci pour le partage, c'est très utile.",
        "J'ai eu la même expérience récemment.",
        "Très bon point de vue, je n'y avais pas pensé.",
        "As-tu essayé cette autre approche ?",
        "Je ne suis pas sûr de comprendre, peux-tu expliquer davantage ?",
        "C'est exactement ce dont j'avais besoin !",
        "Je vais essayer ça dans mon prochain projet."
    ];

    // Pour chaque post, créer quelques commentaires
    posts.forEach(post => {
        // Nombre aléatoire de commentaires par post (entre 0 et commentsPerPost)
        const numComments = Math.floor(Math.random() * (commentsPerPost + 1));

        for (let i = 0; i < numComments; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];

            comments.push({
                userId: randomUser._id,
                content: randomContent,
                media: [], // Les commentaires n'ont généralement pas de médias
                hashtags: [], // Les commentaires n'ont généralement pas de hashtags
                likesCount: 0,
                repostsCount: 0,
                commentsCount: 0, // Pour permettre les réponses aux commentaires
                parentId: post._id // Référence au post parent
            });
        }
    });

    return comments;
};

// Fonction pour générer des réponses aux commentaires (commentaires imbriqués)
const generateReplies = (users, comments, repliesPerComment = 2) => {
    const replies = [];
    const replyContents = [
        "Je suis d'accord avec ton commentaire !",
        "Merci pour ton feedback.",
        "Bonne remarque, je n'avais pas vu ça comme ça.",
        "Exactement !",
        "Oui, c'est une bonne idée.",
        "Je vais essayer ça, merci !",
        "Intéressant, as-tu d'autres suggestions ?",
        "Je ne suis pas tout à fait d'accord, mais je comprends ton point de vue.",
        "C'est vraiment utile comme information.",
        "Cool, merci pour ta réponse !"
    ];

    // Pour chaque commentaire, créer quelques réponses
    comments.forEach(comment => {
        // Probabilité de 30% qu'un commentaire ait des réponses
        if (Math.random() > 0.7) {
            // Nombre aléatoire de réponses par commentaire (entre 1 et repliesPerComment)
            const numReplies = Math.floor(Math.random() * repliesPerComment) + 1;

            for (let i = 0; i < numReplies; i++) {
                const randomUser = users[Math.floor(Math.random() * users.length)];
                const randomContent = replyContents[Math.floor(Math.random() * replyContents.length)];

                replies.push({
                    userId: randomUser._id,
                    content: randomContent,
                    media: [],
                    hashtags: [],
                    likesCount: 0,
                    repostsCount: 0,
                    commentsCount: 0,
                    parentId: comment._id // Référence au commentaire parent
                });
            }
        }
    });

    return replies;
};

// Fonction pour mettre à jour les compteurs de commentaires des posts
const updateCommentCounts = async (posts, comments) => {
    for (const post of posts) {
        // Compter le nombre de commentaires directs pour ce post
        const commentCount = comments.filter(comment =>
            comment.parentId && comment.parentId.toString() === post._id.toString()
        ).length;

        if (commentCount > 0) {
            await Post.findByIdAndUpdate(post._id, { commentsCount: commentCount });
        }
    }
};

// Fonction principale pour créer les posts et commentaires
const seed = async (users) => {
    try {
        // Supprimer tous les posts existants
        await Post.deleteMany({});

        // Générer et insérer les posts principaux
        const postsData = generatePosts(users, 50);
        const createdPosts = await Post.insertMany(postsData);

        // Générer et insérer les commentaires
        const commentsData = generateComments(users, createdPosts, 5);
        const createdComments = await Post.insertMany(commentsData);

        // Générer et insérer les réponses aux commentaires
        const repliesData = generateReplies(users, createdComments, 2);
        await Post.insertMany(repliesData);

        // Mettre à jour les compteurs de commentaires
        await updateCommentCounts(createdPosts, commentsData);
        await updateCommentCounts(createdComments, repliesData);

        console.log(`Seed terminé avec succès : ${createdPosts.length} posts, ${commentsData.length} commentaires, ${repliesData.length} réponses.`);

        return [...createdPosts, ...createdComments, ...repliesData];
    } catch (error) {
        console.error('Erreur lors de la création des posts et commentaires:', error);
        throw error;
    }
};

module.exports = { seed };
