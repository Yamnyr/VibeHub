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

    // Fonction pour basculer l'abonnement (simplifiée)
    const handleToggleFollow = async (targetUserId: string) => {
        if (!targetUserId) return;

        try {
            const result = await ProfileService.toggleFollow(targetUserId);

            // Si on toggle l'abonnement au profil affiché actuellement
            if (targetUserId === userId && user) {
                setIsFollowing(result.isFollowing);

                // Mettre à jour la liste des abonnés
                fetchData();
            } else {
                // Mettre à jour la liste des abonnements si nécessaire
                const currentUserId = authService.getCurrentUser()?.user?._id;
                if (currentUserId) {
                    const updatedFollowing = await ProfileService.getUserFollowing(currentUserId);
                    setFollowing(updatedFollowing);
                }
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
                isFollowing={isFollowing}
            />
        </div>
    );
}