import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MessageCircle, Repeat2, Heart, Users } from "lucide-react";
import ProfileService, { User, Post } from "../services/profileService";
import AvatarPlaceholder from "../components/Avatar";

export default function Profile() {
    const { userId } = useParams<{ userId: string }>();

    // ✅ États pour stocker les données
    const [user, setUser] = useState<User | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [likes, setLikes] = useState<Post[]>([]);
    const [reposts, setReposts] = useState<Post[]>([]);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        if (!userId) return;
        setLoading(true);

        try {
            const [userData, userPosts, userLikes, userReposts, userFollowers, userFollowing] = await Promise.all([
                ProfileService.getUserById(userId),
                ProfileService.getUserPosts(userId),
                ProfileService.getUserLikes(userId),
                ProfileService.getUserReposts(userId),
                ProfileService.getUserFollowers(userId),
                ProfileService.getUserFollowing(userId),
            ]);

            setUser(userData);
            setPosts(userPosts);
            setLikes(userLikes);
            setReposts(userReposts);
            setFollowers(userFollowers);
            setFollowing(userFollowing);
        } catch (error) {
            console.error("Erreur lors du chargement des données utilisateur:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [userId]);

    if (loading) return <div className="text-center text-gray-500">Chargement...</div>;
    if (!user) return <div className="text-center text-gray-500">Utilisateur introuvable</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* ✅ Bannière utilisateur */}
            <div className="relative w-full h-40 bg-gray-800 rounded-lg">
                {user.banner ? (
                    <img src={user.banner} alt="Bannière" className="w-full h-full object-cover rounded-lg" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">Pas de bannière</div>
                )}
            </div>

            {/* ✅ Profil utilisateur */}
            <div className="relative -mt-12 flex items-center space-x-4 px-4">
                <AvatarPlaceholder src={user.profilePicture} />
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.username}</h2>
                    <p className="text-gray-500">@{user.username}</p>
                    <p className="text-[var(--text-primary)] mt-2">{user.bio || "Pas de bio"}</p>
                </div>
            </div>

            {/* ✅ Stats */}
            <div className="flex justify-around text-gray-500 mt-4">
                <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span>{followers.length} Abonnés</span>
                </div>
                <div className="flex items-center space-x-2">
                    <Users size={18} />
                    <span>{following.length} Abonnements</span>
                </div>
            </div>

            {/* ✅ Historique des posts */}
            <div className="mt-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">Posts & Interactions</h3>
                {posts.length === 0 ? (
                    <p className="text-gray-500 mt-2">Aucun post pour l’instant.</p>
                ) : (
                    posts.map((post) => (
                        <div
                            key={post._id}
                            className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 mt-4 cursor-pointer hover:bg-opacity-80 transition-all"
                        >
                            <div className="flex space-x-4">
                                <img
                                    src={user.profilePicture || "/placeholder.svg"}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                        <span className="font-bold text-[var(--text-primary)]">{user.username}</span>
                                        <span className="text-gray-500 text-sm">@{user.username}</span>
                                    </div>
                                    <p className="text-[var(--text-primary)] mt-2">{post.content}</p>

                                    {/* ✅ Icônes d'interaction */}
                                    <div className="flex justify-between text-gray-500 mt-3 text-sm">
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <MessageCircle size={18} /> <span>{post.comments}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <Repeat2 size={18} className={post.isReposted ? "text-[var(--accent)]" : ""} />
                                            <span>{reposts.length}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <Heart size={18} className={post.isLiked ? "text-red-500" : ""} />
                                            <span>{likes.length}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
