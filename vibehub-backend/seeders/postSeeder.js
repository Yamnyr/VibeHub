const Post = require('../models/Post');

const generatePosts = (users, count = 50) => {
    const posts = [];
    const hashtags = ['#javascript', '#nodejs', '#mongodb', '#reactjs', '#webdev', '#coding', '#programming', '#tech', '#innovation', '#design', '#ai', '#fullstack', '#frontend', '#backend'];
    const mediaUrls = [
        'https://picsum.photos/id/1/800/600',
        'https://picsum.photos/id/20/800/600',
        'https://picsum.photos/id/30/800/600',
        'https://picsum.photos/id/40/800/600',
        'https://picsum.photos/id/50/800/600'
    ];

    // Long contents in French
    const longContentsFrench = [
        "Je viens de découvrir une nouvelle technologie incroyable qui pourrait révolutionner la façon dont nous développons des applications web. Après plusieurs heures d'exploration, je suis convaincu que cela va changer notre approche du développement frontend. Les performances sont exceptionnelles et l'API est intuitive.",
        "Voici mon dernier projet sur lequel j'ai travaillé pendant ces trois derniers mois. C'est une application qui combine l'intelligence artificielle et l'analyse de données pour aider les développeurs à optimiser leur code. N'hésitez pas à me donner votre avis et vos suggestions d'amélioration. Je suis particulièrement intéressé par des retours sur l'interface utilisateur.",
        "Je viens de publier un nouvel article détaillé sur mon blog concernant l'optimisation des performances dans les applications React. J'y aborde les problèmes courants que j'ai rencontrés dans mes projets et les solutions que j'ai mises en place pour améliorer significativement les temps de chargement et la réactivité de l'interface. Lien en bio pour ceux qui sont intéressés !"
    ];

    // Long contents in English
    const longContentsEnglish = [
        "I just discovered an amazing new technology that could revolutionize the way we develop web applications. After several hours of exploration, I'm convinced it will change our approach to frontend development. The performance is exceptional and the API is intuitive.",
        "Here's my latest project I've been working on for the past three months. It's an application that combines artificial intelligence and data analysis to help developers optimize their code. Feel free to give me your feedback and suggestions for improvement. I'm particularly interested in feedback on the user interface.",
        "I just published a detailed article on my blog about performance optimization in React applications. I address common problems I've encountered in my projects and the solutions I've implemented to significantly improve loading times and interface responsiveness. Link in bio for those interested!"
    ];

    // Medium contents in French
    const mediumContentsFrench = [
        "Cette conférence sur le développement durable dans la tech était vraiment inspirante. Les intervenants ont partagé des approches concrètes pour réduire l'empreinte carbone de nos applications et infrastructures.",
        "Je cherche des recommandations pour un bon framework CSS qui soit à la fois léger, performant et flexible. J'ai essayé plusieurs solutions comme Tailwind, Bootstrap et Bulma, mais je n'ai pas encore trouvé celui qui répond parfaitement à mes besoins.",
        "Journée productive aujourd'hui ! J'ai enfin résolu ce bug complexe qui me tracassait depuis deux semaines. Il s'agissait d'une interaction subtile entre plusieurs composants asynchrones qui provoquait une condition de course."
    ];

    // Medium contents in English
    const mediumContentsEnglish = [
        "This conference on sustainable development in tech was truly inspiring. The speakers shared concrete approaches to reduce the carbon footprint of our applications and infrastructures.",
        "I'm looking for recommendations for a good CSS framework that is lightweight, performant, and flexible. I've tried several solutions like Tailwind, Bootstrap, and Bulma, but I haven't found one that perfectly meets my needs yet.",
        "Productive day today! I finally solved that complex bug that had been bothering me for two weeks. It involved a subtle interaction between several asynchronous components that caused a race condition."
    ];

    // Short contents in French
    const shortContentsFrench = [
        "Bug résolu après 3 jours de débogage. Victoire !",
        "Qui utilise TypeScript ici ? J'hésite à me lancer.",
        "Nouvelle version de mon site perso en ligne. Feedback bienvenu !",
        "Cherche développeur React pour projet freelance.",
        "J'adore le nouveau design de VS Code."
    ];

    // Short contents in English
    const shortContentsEnglish = [
        "Bug fixed after 3 days of debugging. Victory!",
        "Who's using TypeScript here? I'm thinking about giving it a try.",
        "New version of my personal website online. Feedback welcome!",
        "Looking for a React developer for a freelance project.",
        "Loving the new VS Code design."
    ];

    // Additional paragraphs in French
    const additionalParagraphsFrench = [
        "En approfondissant ce sujet, j'ai réalisé à quel point notre industrie évolue rapidement. Les outils et techniques que nous utilisions il y a seulement deux ans semblent déjà obsolètes face aux nouvelles innovations.",
        "J'ai récemment participé à un workshop qui a changé ma perspective sur cette question. Les experts présents ont partagé des insights précieux basés sur leurs années d'expérience dans le domaine.",
        "Les défis techniques que j'ai rencontrés m'ont poussé à sortir de ma zone de confort et à explorer des solutions auxquelles je n'aurais pas pensé initialement."
    ];

    // Additional paragraphs in English
    const additionalParagraphsEnglish = [
        "Diving deeper into this topic, I realized how quickly our industry is evolving. The tools and techniques we used just two years ago already seem obsolete compared to new innovations.",
        "I recently participated in a workshop that changed my perspective on this issue. The experts shared valuable insights based on their years of experience in the field.",
        "The technical challenges I encountered pushed me out of my comfort zone and led me to explore solutions I wouldn't have initially considered."
    ];

    for (let i = 0; i < count; i++) {
        const randomUser = users[Math.floor(Math.random() * users.length)];

        // Decide language and content length
        const isEnglish = Math.random() > 0.7; // 30% chance for English content
        const contentType = Math.random();

        let content;
        let additionalContent = "";

        // Select content based on length and language
        if (contentType < 0.4) { // 40% long content
            content = isEnglish
                ? longContentsEnglish[Math.floor(Math.random() * longContentsEnglish.length)]
                : longContentsFrench[Math.floor(Math.random() * longContentsFrench.length)];

            // Add 1-2 additional paragraphs for long content
            const paragraphCount = Math.floor(Math.random() * 2) + 1;
            for (let j = 0; j < paragraphCount; j++) {
                const randomParagraph = isEnglish
                    ? additionalParagraphsEnglish[Math.floor(Math.random() * additionalParagraphsEnglish.length)]
                    : additionalParagraphsFrench[Math.floor(Math.random() * additionalParagraphsFrench.length)];
                additionalContent += "\n\n" + randomParagraph;
            }
        }
        else if (contentType < 0.7) { // 30% medium content
            content = isEnglish
                ? mediumContentsEnglish[Math.floor(Math.random() * mediumContentsEnglish.length)]
                : mediumContentsFrench[Math.floor(Math.random() * mediumContentsFrench.length)];

            // Sometimes add 1 additional paragraph for medium content
            if (Math.random() > 0.5) {
                const randomParagraph = isEnglish
                    ? additionalParagraphsEnglish[Math.floor(Math.random() * additionalParagraphsEnglish.length)]
                    : additionalParagraphsFrench[Math.floor(Math.random() * additionalParagraphsFrench.length)];
                additionalContent = "\n\n" + randomParagraph;
            }
        }
        else { // 30% short content
            content = isEnglish
                ? shortContentsEnglish[Math.floor(Math.random() * shortContentsEnglish.length)]
                : shortContentsFrench[Math.floor(Math.random() * shortContentsFrench.length)];
            // No additional paragraphs for short content
        }

        const fullContent = content + additionalContent;

        // Hashtags - fewer for short posts
        const randomHashtagCount = contentType < 0.7 ? (Math.floor(Math.random() * 3) + 1) : (Math.floor(Math.random() * 2) + 1);
        const selectedHashtags = [];

        for (let j = 0; j < randomHashtagCount; j++) {
            const randomHashtag = hashtags[Math.floor(Math.random() * hashtags.length)];
            if (!selectedHashtags.includes(randomHashtag)) {
                selectedHashtags.push(randomHashtag);
            }
        }

        // Media - less likely for short posts
        const hasMedia = contentType < 0.7 ? (Math.random() > 0.6) : (Math.random() > 0.8);
        const media = hasMedia ? [mediaUrls[Math.floor(Math.random() * mediaUrls.length)]] : [];

        // Engagement metrics
        const likesCount = Math.floor(Math.random() * users.length);
        const repostsCount = Math.floor(Math.random() * (users.length / 2));
        const signetsCount = Math.floor(Math.random() * (users.length / 3));

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
            content: `${fullContent} ${selectedHashtags.join(' ')}`,
            media,
            hashtags: selectedHashtags.map(tag => tag.substring(1)), // Remove # for storage
            likes: randomLikes,
            reposts: randomReposts,
            signets: randomSignets,
            likesCount: randomLikes.length,
            repostsCount: randomReposts.length,
            signetsCount: randomSignets.length,
            commentsCount: 0,
            parentId: null // These are main posts
        });
    }

    return posts;
};

// Function to generate comments for existing posts
const generateComments = (users, posts, commentsPerPost = 5) => {
    const comments = [];

    // French comments
    const commentContentsFrench = [
        "Je suis totalement d'accord avec toi ! J'ai eu une expérience similaire récemment.",
        "Très intéressant, merci pour le partage. Ce type de contenu est exactement ce dont notre communauté a besoin.",
        "As-tu des ressources à recommander sur ce sujet ?",
        "J'ai eu une expérience similaire, mais avec quelques différences notables.",
        "Super article, très bien écrit ! La clarté de ton explication est remarquable.",
        "Je vais essayer ça dans mon prochain projet.",
        "Quelle est ton opinion sur les alternatives disponibles ?",
        "C'est exactement ce que je cherchais, merci !",
        "Je ne suis pas tout à fait d'accord, mais ton analyse est pertinente."
    ];

    // English comments
    const commentContentsEnglish = [
        "I totally agree with you! I had a similar experience recently.",
        "Very interesting, thanks for sharing. This type of content is exactly what our community needs.",
        "Do you have any resources to recommend on this topic?",
        "I had a similar experience, but with some notable differences.",
        "Great article, very well written! The clarity of your explanation is remarkable.",
        "I'll try this in my next project.",
        "What's your opinion on the available alternatives?",
        "This is exactly what I was looking for, thanks!",
        "I don't quite agree, but your analysis is relevant."
    ];

    // For each post, generate several comments
    posts.forEach(post => {
        // Shorter posts get fewer comments
        const postLength = post.content.length;
        const maxComments = postLength < 100 ? 3 : commentsPerPost;
        const commentCount = Math.floor(Math.random() * maxComments) + 1;

        for (let i = 0; i < commentCount; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];

            // Match comment language to post language (simple detection)
            const isPostInEnglish = /^[a-zA-Z0-9\s,.!?]*$/.test(post.content.split(' ')[0]);
            const commentContent = isPostInEnglish
                ? commentContentsEnglish[Math.floor(Math.random() * commentContentsEnglish.length)]
                : commentContentsFrench[Math.floor(Math.random() * commentContentsFrench.length)];

            // Select users who liked this comment
            const likesCount = Math.floor(Math.random() * (users.length / 4));
            const randomLikes = [];

            while (randomLikes.length < likesCount) {
                const randomLikeUser = users[Math.floor(Math.random() * users.length)];
                if (!randomLikes.includes(randomLikeUser._id) && randomLikeUser._id !== randomUser._id) {
                    randomLikes.push(randomLikeUser._id);
                }
            }

            comments.push({
                userId: randomUser._id,
                content: commentContent,
                parentId: post._id,
                likes: randomLikes,
                reposts: [],
                signets: [],
                likesCount: randomLikes.length,
                repostsCount: 0,
                signetsCount: 0,
                commentsCount: 0,
                hashtags: [],
                media: []
            });
        }

        // Update comment count for parent post
        post.commentsCount += commentCount;
    });

    return { comments, updatedPosts: posts };
};

// Main function to create posts and comments
const seed = async (users) => {
    try {
        // Delete all existing posts
        await Post.deleteMany({});

        // Generate and insert main posts
        const postsData = generatePosts(users, 50);
        const createdPosts = await Post.insertMany(postsData);

        console.log(`✅ ${createdPosts.length} main posts created`);

        // Generate comments for posts
        const { comments, updatedPosts } = generateComments(users, createdPosts, 5);

        // Insert comments
        const createdComments = await Post.insertMany(comments);

        console.log(`✅ ${createdComments.length} comments created`);

        // Update comment count for each parent post
        for (const post of updatedPosts) {
            await Post.updateOne(
                { _id: post._id },
                { $set: { commentsCount: post.commentsCount } }
            );
        }

        console.log('✅ Comment counts updated for parent posts');

        return [...createdPosts, ...createdComments];
    } catch (error) {
        console.error('❌ Error seeding posts and comments:', error);
        throw error;
    }
};

module.exports = { seed };