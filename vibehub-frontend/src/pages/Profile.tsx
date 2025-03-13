// Profile.tsx - Composant principal
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProfileService, { User, Post as PostType } from "../services/profileService";
import authService from "../services/authService";
import ProfileHeader from "../components/profile/ProfileHeader";
import ProfileTabs from "../components/profile/ProfileTabs";
import ProfileContent from "../components/profile/ProfileContent";

export default function Profile() {
    const { userId } = useParams<{ userId: string }>();

    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<PostType[]>([]);
    const [likes, setLikes] = useState<PostType[]>([]);
    const [reposts, setReposts] = useState<PostType[]>([]);
    const [savedPosts, setSavedPosts] = useState<PostType[]>([]);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'posts' | 'likes' | 'reposts' | 'savedPosts' | 'followers' | 'following'>('posts');
    const [isFollowing, setIsFollowing] = useState(false);
    const [isCurrentUser, setIsCurrentUser] = useState(false);

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);

        try {
            // Vérifier si le profile affiché est celui de l'utilisateur courant
            const currentUser = authService.getCurrentUser();
            const isCurrentUserProfile = currentUser?.user?._id === userId;
            setIsCurrentUser(isCurrentUserProfile);

            const userData = await ProfileService.getUserById(userId);
            const [userPosts, userFollowers, userFollowing] = await Promise.all([
                ProfileService.getUserPosts(userId),
                ProfileService.getUserFollowers(userId),
                ProfileService.getUserFollowing(userId),
            ]);

            // Vérifier si l'utilisateur courant suit déjà cet utilisateur
            if (currentUser && !isCurrentUserProfile) {
                const isAlreadyFollowing = userFollowers.some(
                    follower => follower._id === currentUser.user._id
                );
                setIsFollowing(isAlreadyFollowing);
            }

            setUser(userData);
            setPosts(userPosts);
            setLikes(userData.likedPosts || []);
            setReposts(userData.repostedPosts || []);

            // Ne charger les signets que si c'est le profil de l'utilisateur connecté
            if (isCurrentUserProfile) {
                setSavedPosts(userData.savedPosts || []);
            }

            setFollowers(userFollowers);
            setFollowing(userFollowing);
        } catch (error) {
            console.error("Erreur lors du chargement des données utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    // Fonction pour basculer l'abonnement
    const handleToggleFollow = async (targetUserId?: string) => {
        // Utiliser targetUserId s'il est fourni, sinon utiliser l'ID du profil actuel
        const userToToggle = targetUserId || userId;

        if (!userToToggle || !user) return;

        try {
            const result = await ProfileService.toggleFollow(userToToggle);

            // Si on modifie l'abonnement au profil actuel
            if (userToToggle === userId) {
                setIsFollowing(result.isFollowing);

                // Mettre à jour le nombre d'abonnés
                if (result.isFollowing) {
                    // Ajouter l'utilisateur courant aux abonnés si ce n'est pas déjà le cas
                    const currentUser = authService.getCurrentUser();
                    if (currentUser && !followers.some(f => f._id === currentUser.user._id)) {
                        const currentUserData = await ProfileService.getUserById(currentUser.user._id);
                        setFollowers(prev => [...prev, currentUserData]);
                    }
                } else {
                    // Retirer l'utilisateur courant des abonnés
                    const currentUser = authService.getCurrentUser();
                    if (currentUser) {
                        setFollowers(prev => prev.filter(f => f._id !== currentUser.user._id));
                    }
                }
            } else {
                // Si on modifie un abonnement dans la liste, mettre à jour la liste des abonnements
                setFollowing(prev =>
                    result.isFollowing
                        ? [...prev, { _id: userToToggle }] // Ajouter l'utilisateur
                        : prev.filter(f => f._id !== userToToggle) // Retirer l'utilisateur
                );
            }
        } catch (error) {
            console.error("Erreur lors de la modification de l'abonnement:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    // Réinitialiser l'onglet actif si l'utilisateur navigue vers un autre profil
    // et que l'onglet actif était "savedPosts"
    useEffect(() => {
        if (!isCurrentUser && activeTab === 'savedPosts') {
            setActiveTab('posts');
        }
    }, [isCurrentUser, activeTab]);

    if (loading) return <div className="text-center text-gray-500">Chargement...</div>;
    if (!user) return <div className="text-center text-gray-500">Utilisateur introuvable</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <ProfileHeader
                user={user}
                isCurrentUser={isCurrentUser}
                isFollowing={isFollowing}
                handleToggleFollow={handleToggleFollow}
                followersCount={followers.length}
                followingCount={following.length}
                onTabChange={setActiveTab}
            />

            <ProfileTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                isCurrentUser={isCurrentUser}
            />

            <ProfileContent
                activeTab={activeTab}
                posts={posts}
                likes={likes}
                reposts={reposts}
                savedPosts={savedPosts}
                followers={followers}
                following={following}
                isCurrentUser={isCurrentUser}
                handleToggleFollow={handleToggleFollow}
            />
        </div>
    );
}