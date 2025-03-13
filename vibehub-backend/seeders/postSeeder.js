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

        // Sélectionner aléatoirement des utilisateurs qui ont liké, reposté ou mis en signet
        const likesCount = Math.floor(Math.random() * users.length);
        const repostsCount = Math.floor(Math.random() * users.length);
        const signetsCount = Math.floor(Math.random() * (users.length / 2)); // Moins de signets que de likes/reposts

        const randomLikes = [];
        const randomReposts = [];
        const randomSignets = [];

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

        while (randomSignets.length < signetsCount) {
            const randomSignetUser = users[Math.floor(Math.random() * users.length)];
            if (!randomSignets.includes(randomSignetUser._id) && randomSignetUser._id !== randomUser._id) {
                randomSignets.push(randomSignetUser._id);
            }
        }

        posts.push({
            userId: randomUser._id,
            content: `${randomContent} ${selectedHashtags.join(' ')}`,
            media,
            hashtags: selectedHashtags.map(tag => tag.substring(1)), // Enlever le # pour stocker
            likes: randomLikes, // Les utilisateurs qui ont liké ce post
            reposts: randomReposts, // Les utilisateurs qui ont reposté ce post
            signets: randomSignets, // Les utilisateurs qui ont mis le post en signet
            likesCount: randomLikes.length,
            repostsCount: randomReposts.length,
            signetsCount: randomSignets.length,
            commentsCount: 0,
            parentId: null // Ces posts sont des posts principaux
        });
    }

    return posts;
};

// Fonction pour générer des commentaires pour les posts existants
const generateComments = (users, posts, commentsPerPost = 5) => {
    const comments = [];
    const commentContents = [
        "Je suis totalement d'accord avec toi !",
        "Très intéressant, merci pour le partage.",
        "As-tu des ressources à recommander sur ce sujet ?",
        "J'ai eu une expérience similaire récemment.",
        "Pourrais-tu expliquer davantage cette partie ?",
        "Super article, très bien écrit !",
        "Je vais essayer ça dans mon prochain projet.",
        "Quelle est ton opinion sur les alternatives ?",
        "C'est exactement ce que je cherchais, merci !",
        "Je ne suis pas tout à fait d'accord, mais ton point de vue est intéressant."
    ];

    // Pour chaque post, générer plusieurs commentaires
    posts.forEach(post => {
        const commentCount = Math.floor(Math.random() * commentsPerPost) + 1; // 1 à commentsPerPost commentaires

        for (let i = 0; i < commentCount; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomContent = commentContents[Math.floor(Math.random() * commentContents.length)];

            // Sélectionner aléatoirement des utilisateurs qui ont liké ce commentaire
            const likesCount = Math.floor(Math.random() * (users.length / 3));
            const randomLikes = [];

            while (randomLikes.length < likesCount) {
                const randomLikeUser = users[Math.floor(Math.random() * users.length)];
                if (!randomLikes.includes(randomLikeUser._id) && randomLikeUser._id !== randomUser._id) {
                    randomLikes.push(randomLikeUser._id);
                }
            }

            comments.push({
                userId: randomUser._id,
                content: randomContent,
                parentId: post._id, // ID du post parent
                likes: randomLikes,
                reposts: [], // Généralement, les commentaires ne sont pas repostés
                signets: [], // Généralement, les commentaires ne sont pas mis en signet
                likesCount: randomLikes.length,
                repostsCount: 0,
                signetsCount: 0,
                commentsCount: 0, // Les commentaires de commentaires ne sont pas gérés ici
                hashtags: [], // Généralement pas de hashtags dans les commentaires
                media: [] // Généralement pas de médias dans les commentaires
            });
        }

        // Mettre à jour le nombre de commentaires pour le post parent
        post.commentsCount += commentCount;
    });

    return { comments, updatedPosts: posts };
};

// Fonction principale pour créer les posts et les commentaires
const seed = async (users) => {
    try {
        // Supprimer tous les posts existants
        await Post.deleteMany({});

        // Générer et insérer les posts principaux
        const postsData = generatePosts(users, 50);
        const createdPosts = await Post.insertMany(postsData);

        console.log(`✅ ${createdPosts.length} posts principaux créés`);

        // Générer des commentaires pour les posts
        const { comments, updatedPosts } = generateComments(users, createdPosts, 5);

        // Insérer les commentaires
        const createdComments = await Post.insertMany(comments);

        console.log(`✅ ${createdComments.length} commentaires créés`);

        // Mettre à jour le nombre de commentaires pour chaque post parent
        for (const post of updatedPosts) {
            await Post.updateOne(
                { _id: post._id },
                { $set: { commentsCount: post.commentsCount } }
            );
        }

        console.log('✅ Nombre de commentaires mis à jour pour les posts parents');

        return [...createdPosts, ...createdComments];
    } catch (error) {
        console.error('❌ Erreur lors du seed des posts et commentaires:', error);
        throw error;
    }
};

module.exports = { seed };