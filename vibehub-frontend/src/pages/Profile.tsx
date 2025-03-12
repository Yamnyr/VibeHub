import { useAuth } from "../context/AuthContext.tsx";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LogOut, MessageCircle, Repeat2, Heart, Users } from "lucide-react";

// ✅ Définition d'un type User pour TypeScript
type User = {
    _id: string;
    username: string;
    profilePicture?: string;
    banner?: string;
    bio?: string;
    followersCount?: number;
    followingCount?: number;
};

// ✅ Définition d'un type post pour éviter les erreurs TypeScript
type post = {
    _id: string;
    content: string;
    userId: string;
    likesCount: number;
    repostsCount: number;
    commentsCount: number;
    isLiked?: boolean;
    isReposted?: boolean;
};

export default function Profile() {
    const { user: currentUser, logout } = useAuth(); // Utilisateur connecté
    const { userId } = useParams<{ userId: string }>(); // Récupère l'ID utilisateur depuis l'URL
    const [user, setUser] = useState<User | null>(null);
    const [posts, setposts] = useState<post[]>([]);
    const [likes, setLikes] = useState<post[]>([]);
    const [reposts, setReposts] = useState<post[]>([]);
    const [followers, setFollowers] = useState<User[]>([]);
    const [following, setFollowing] = useState<User[]>([]);
    const isCurrentUser = currentUser?._id === userId; // Vérifie si c'est l'utilisateur connecté

    useEffect(() => {
        if (userId) {
            fetch(`http://localhost:5000/api/users/${userId}`)
                .then(res => res.json())
                .then(data => {console.log(data); return setUser(data)});

            fetch(`http://localhost:5000/api/users/${userId}/posts`)
                .then(res => res.json())
                .then(data => setposts(data));

            fetch(`http://localhost:5000/api/users/${userId}/likes`)
                .then(res => res.json())
                .then(data => setLikes(data));

            fetch(`http://localhost:5000/api/users/${userId}/reposts`)
                .then(res => res.json())
                .then(data => setReposts(data));

            fetch(`http://localhost:5000/api/users/${userId}/followers`)
                .then(res => res.json())
                .then(data => setFollowers(data));

            fetch(`http://localhost:5000/api/users/${userId}/following`)
                .then(res => res.json())
                .then(data => setFollowing(data));
        }
    }, [userId]);

    if (!user) return <div className="text-center text-gray-500">Chargement...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            {/* Bannière */}
            <div className="relative w-full h-40 bg-gray-800 rounded-lg">
                {user.banner ? (
                    <img
                        src={user.banner}
                        alt="Bannière"
                        className="w-full h-full object-cover rounded-lg"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">
                        Pas de bannière
                    </div>
                )}
            </div>

            {/* Profil */}
            <div className="relative -mt-12 flex items-center space-x-4 px-4">
                <img
                    src={user.profilePicture || "/placeholder.svg"}
                    alt={user.username}
                    className="w-24 h-24 rounded-full border-4 border-[var(--bg-secondary)]"
                />
                <div>
                    <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.username}</h2>
                    <p className="text-gray-500">@{user.username}</p>
                    <p className="text-[var(--text-primary)] mt-2">{user.bio || "Pas de bio"}</p>
                </div>
                {/* ✅ Bouton de déconnexion affiché uniquement si c'est l'utilisateur connecté */}
                {isCurrentUser && (
                    <button
                        onClick={logout}
                        className="ml-auto bg-red-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2"
                    >
                        <LogOut size={18} />
                        <span>Déconnexion</span>
                    </button>
                )}
            </div>

            {/* Stats */}
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

            {/* Historique des posts */}
            <div className="mt-6">
                <h3 className="text-lg font-bold text-[var(--text-primary)]">posts & Interactions</h3>
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
                                        <span className="font-bold text-[var(--text-primary)]">
                                            {user.username}
                                        </span>
                                        <span className="text-gray-500 text-sm">@{user.username}</span>
                                    </div>
                                    <p className="text-[var(--text-primary)] mt-2">{post.content}</p>

                                    {/* Icônes d'interaction */}
                                    <div className="flex justify-between text-gray-500 mt-3 text-sm">
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <MessageCircle size={18} /> <span>{post.commentsCount}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <Repeat2 size={18} className={post.isReposted ? "text-[var(--accent)]" : ""} />
                                            <span>{post.repostsCount}</span>
                                        </div>
                                        <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                                            <Heart size={18} className={post.isLiked ? "text-red-500" : ""} />
                                            <span>{post.likesCount}</span>
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
