const User = require('../models/User');
const Tweet = require('../models/Post'); // Notez que le modèle s'appelle Post mais représente les tweets
const Like = require('../models/Like');
const Repost = require('../models/Repost');
const Signet = require('../models/Signet');
const Follow = require('../models/Follow');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Inscription de l'utilisateur
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        // Vérifier si l'email ou le nom d'utilisateur existe déjà
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ error: 'Email ou nom d\'utilisateur déjà pris.' });
        }

        // Hacher le mot de passe
        const hashedPassword = await bcrypt.hash(password, 10);

        // Créer un nouvel utilisateur
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
        });

        await newUser.save();

        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Connexion de l'utilisateur
exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Trouver l'utilisateur par son email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Vérifier le mot de passe
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Mot de passe incorrect' });
        }

        // Créer un token JWT
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({
            message: 'Connexion réussie',
            token,
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                bio: user.bio,
                followersCount: user.followersCount,
                followingCount: user.followingCount
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la connexion' });
    }
};

// Mise à jour du profil utilisateur
exports.updateProfile = async (req, res) => {
    const { username, bio, profilePicture, banner } = req.body;
    const userId = req.userId;  // Cela vient du middleware d'authentification

    try {
        // Vérifier si le nom d'utilisateur est déjà pris (si changé)
        if (username) {
            const existingUser = await User.findOne({ username, _id: { $ne: userId } });
            if (existingUser) {
                return res.status(400).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
            }
        }

        // Trouver l'utilisateur par son ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        // Mettre à jour les informations de l'utilisateur
        if (username) user.username = username;
        if (bio !== undefined) user.bio = bio;
        if (profilePicture) user.profilePicture = profilePicture;
        if (banner) user.banner = banner;

        await user.save();

        res.status(200).json({
            message: 'Profil mis à jour avec succès',
            user: {
                _id: user._id,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                banner: user.banner,
                bio: user.bio,
                followersCount: user.followersCount,
                followingCount: user.followingCount
            }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la mise à jour du profil' });
    }
};

// Obtenir le profil d'un utilisateur par son ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
};

// Obtenir le profil d'un utilisateur par son nom d'utilisateur
exports.getUserByUsername = async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username }).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
};

// Obtenir le profil de l'utilisateur connecté
exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');

        if (!user) {
            return res.status(404).json({ error: 'Utilisateur non trouvé' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération du profil' });
    }
};

// Obtenir tous les tweets d'un utilisateur
exports.getUserTweets = async (req, res) => {
    try {
        const tweets = await Tweet.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('userId', 'username profilePicture');

        res.status(200).json(tweets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des tweets' });
    }
};

// Obtenir tous les tweets likés par un utilisateur
exports.getUserLikes = async (req, res) => {
    try {
        const likes = await Like.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    select: 'username profilePicture'
                }
            });

        const likedTweets = likes.map(like => like.postId);
        res.status(200).json(likedTweets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des tweets likés' });
    }
};

// Obtenir tous les retweets d'un utilisateur
exports.getUserRetweets = async (req, res) => {
    try {
        const reposts = await Repost.find({ userId: req.params.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    select: 'username profilePicture'
                }
            });

        const retweetedTweets = reposts.map(repost => repost.posttId);
        res.status(200).json(retweetedTweets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des retweets' });
    }
};

// Obtenir tous les tweets enregistrés par un utilisateur
exports.getUserSignets = async (req, res) => {
    try {
        const signets = await Signet.find({ userId: req.userId })
            .sort({ createdAt: -1 })
            .populate({
                path: 'postId',
                populate: {
                    path: 'userId',
                    select: 'username profilePicture'
                }
            });

        const savedTweets = signets.map(signet => signet.postId);
        res.status(200).json(savedTweets);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des tweets enregistrés' });
    }
};

// Obtenir tous les abonnés d'un utilisateur
exports.getFollowers = async (req, res) => {
    try {
        const followers = await Follow.find({ followingId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('followerId', 'username profilePicture bio');

        const followersList = followers.map(follow => follow.followerId);
        res.status(200).json(followersList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des abonnés' });
    }
};

// Obtenir tous les abonnements d'un utilisateur
exports.getFollowing = async (req, res) => {
    try {
        const following = await Follow.find({ followerId: req.params.id })
            .sort({ createdAt: -1 })
            .populate('followingId', 'username profilePicture bio');

        const followingList = following.map(follow => follow.followingId);
        res.status(200).json(followingList);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la récupération des abonnements' });
    }
};

// Suivre un utilisateur
exports.followUser = async (req, res) => {
    const followerId = req.userId;
    const followingId = req.params.id;

    // Vérifier que l'utilisateur ne s'abonne pas à lui-même
    if (followerId === followingId) {
        return res.status(400).json({ error: 'Vous ne pouvez pas vous abonner à vous-même' });
    }

    try {
        // Vérifier si l'abonnement existe déjà
        const existingFollow = await Follow.findOne({ followerId, followingId });
        if (existingFollow) {
            return res.status(400).json({ error: 'Vous êtes déjà abonné à cet utilisateur' });
        }

        // Créer un nouvel abonnement
        const newFollow = new Follow({
            followerId,
            followingId
        });

        await newFollow.save();

        // Mettre à jour les compteurs d'abonnés et d'abonnements
        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: 1 } });
        await User.findByIdAndUpdate(followingId, { $inc: { followersCount: 1 } });

        res.status(200).json({ message: 'Abonnement réussi' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de l\'abonnement' });
    }
};

// Se désabonner d'un utilisateur
exports.unfollowUser = async (req, res) => {
    const followerId = req.userId;
    const followingId = req.params.id;

    try {
        // Trouver et supprimer l'abonnement
        const follow = await Follow.findOneAndDelete({ followerId, followingId });

        if (!follow) {
            return res.status(400).json({ error: 'Vous n\'êtes pas abonné à cet utilisateur' });
        }

        // Mettre à jour les compteurs d'abonnés et d'abonnements
        await User.findByIdAndUpdate(followerId, { $inc: { followingCount: -1 } });
        await User.findByIdAndUpdate(followingId, { $inc: { followersCount: -1 } });

        res.status(200).json({ message: 'Désabonnement réussi' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors du désabonnement' });
    }
};

// Rechercher des utilisateurs
exports.searchUsers = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Veuillez fournir un terme de recherche' });
    }

    try {
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } },
                { bio: { $regex: query, $options: 'i' } }
            ]
        }).select('username profilePicture bio followersCount followingCount');

        res.status(200).json(users);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Erreur lors de la recherche d\'utilisateurs' });
    }
};