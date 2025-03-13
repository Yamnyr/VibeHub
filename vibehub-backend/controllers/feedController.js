const Post = require("../models/Post");
const User = require("../models/User");
exports.getUserFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Récupérer l'utilisateur et ses abonnements
        const user = await User.findById(userId).populate('following', '_id');
        const followingIds = user.following.map(u => u._id);
        // followingIds.push(userId); // Inclure ses propres posts

        // Récupérer les posts originaux des utilisateurs suivis
        const originalPosts = await Post.find({
            userId: { $in: followingIds },
            $or: [{ parentId: null }, { parentId: { $exists: false } }]
        });

        // Récupérer les posts repostés par les abonnements
        const usersRepostedPosts = await Post.find({
            reposts: { $in: followingIds },
            userId: { $nin: followingIds }
        });

        // Récupérer les posts likés par l'utilisateur
        const likedPosts = await Post.find({ likes: userId });

        // Extraire les hashtags des posts likés et compter leur fréquence
        const hashtagCounts = {};
        likedPosts.forEach(post => {
            post.hashtags.forEach(hashtag => {
                hashtagCounts[hashtag] = (hashtagCounts[hashtag] || 0) + 1;
            });
        });

        // Trouver les hashtags les plus fréquents
        const sortedHashtags = Object.entries(hashtagCounts)
            .sort((a, b) => b[1] - a[1])
            .map(entry => entry[0])
            .slice(0, 2); // Prendre les 5 hashtags les plus fréquents

        // Récupérer les posts contenant ces hashtags
        let hashtagPosts = [];
        if (sortedHashtags.length > 0) {
            hashtagPosts = await Post.find({ hashtags: { $in: sortedHashtags } });
        }

        // Combiner tous les posts et supprimer les doublons
        let allPosts = [...originalPosts, ...usersRepostedPosts, ...hashtagPosts];
        const uniquePostIds = new Set();
        allPosts = allPosts.filter(post => {
            const isDuplicate = uniquePostIds.has(post._id.toString());
            uniquePostIds.add(post._id.toString());
            return !isDuplicate;
        });

        // Trier par date de création
        allPosts.sort((a, b) => b.createdAt - a.createdAt);

        // Populer les infos utilisateur
        const populatedPosts = await Post.populate(allPosts, {
            path: 'userId',
            select: 'username profilePicture'
        });

        // Ajouter les infos personnalisées (liked, reposted, signeted)
        const feedPosts = populatedPosts.map(post => {
            const postObj = post.toObject ? post.toObject() : post;
            postObj.isLiked = post.likes.some(like => like.toString() === userId.toString());
            postObj.isReposted = post.reposts.some(repost => repost.toString() === userId.toString());
            postObj.isSigneted = post.signets.some(signet => signet.toString() === userId.toString());

            // Ajouter l'origine du post dans le feed
            if (sortedHashtags.some(ht => post.hashtags.includes(ht))) {
                postObj.recommendedByHashtag = true;
            }

            return postObj;
        });

        res.status(200).json(feedPosts);
    } catch (err) {
        console.error('Erreur feed utilisateur:', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités personnalisé' });
    }
};

exports.getGlobalFeed = async (req, res) => {
    try {
        const userId = req.userId;

        // Récupérer tous les posts récents de tous les utilisateurs
        const posts = await Post.find({
            $or: [
                { parentId: null },
                { parentId: { $exists: false } }
            ]
        })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture')
            .lean(); // Utilisation de lean() pour travailler avec des objets JavaScript simples

        // Ajouter si l'utilisateur a liké ou reposté le post
        posts.forEach(post => {
            post.isLiked = post.likes.some(like => like.toString() === userId.toString()); // Vérifie si l'utilisateur a liké le post
            post.isReposted = post.reposts.some(repost => repost.toString() === userId.toString()); // Vérifie si l'utilisateur a reposté le post
            post.isSigneted = post.signets.some(signet => signet.toString() === userId.toString());
        });

        res.status(200).json(posts);
    } catch (err) {
        console.error('Erreur feed global:', err);
        res.status(500).json({ error: 'Une erreur est survenue lors de la récupération du fil d\'actualités global' });
    }
};
