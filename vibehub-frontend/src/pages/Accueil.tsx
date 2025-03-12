import { useEffect, useState } from "react";
import Post from "../components/Post";
import CreatePost from "../components/CreatePost";
import FeedService, { Post as PostType } from "../services/feedService";
import { useAuth } from "../context/AuthContext";

export default function Accueil() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [feedType, setFeedType] = useState<"personal" | "global">("personal");
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    loadFeed();
  }, [feedType, isAuthenticated]);

  const loadFeed = async () => {
    setIsLoading(true);
    try {
      let fetchedPosts: PostType[] = [];

      if (feedType === "personal" && isAuthenticated) {
        fetchedPosts = await FeedService.getUserFeed();
      } else {
        fetchedPosts = await FeedService.getGlobalFeed();
      }

      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Erreur lors du chargement du feed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePostCreated = () => {
    loadFeed(); // Recharger le feed après la création d'un post
  };

  // Formatage des données pour correspondre à l'interface du composant Post
  const formatPosts = (posts: PostType[]) => {
    return posts.map(post => {
      const formattedPost = {
        id: post._id,
        user: {
          id: post.userId._id,
          avatar: post.userId.profilePicture,
          username: post.userId.username,
        },
        content: post.content,
        time: formatTime(new Date(post.createdAt)),
        comments: post.commentsCount || 0,
        likes: post.likesCount || 0,
        shares: post.repostsCount || 0,
        signets: post.signetsCount || 0,
        isLiked: post.isLiked,
        isReposted: post.isReposted,
        isSigneted: post.isSigneted,
        media: post.media || [], // Inclure les médias du post
      };

      return formattedPost;
    });
  };

  // Fonction pour formater le temps (ex: "il y a 2h")
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}j`;
  };

  return (
      <div className="max-w-xl mx-auto mt-5">
        {/* Sélecteur de type de feed */}
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-gray-700 mb-4">
          <div className="flex space-x-2">
            <button
                className={`flex-1 py-2 text-center rounded ${
                    feedType === "personal" ? "bg-[var(--accent)] text-white" : "bg-gray-700"
                }`}
                onClick={() => setFeedType("personal")}
            >
              Personnalisé
            </button>
            <button
                className={`flex-1 py-2 text-center rounded ${
                    feedType === "global" ? "bg-[var(--accent)] text-white" : "bg-gray-700"
                }`}
                onClick={() => setFeedType("global")}
            >
              Global
            </button>
          </div>
        </div>

        {/* Input pour créer un nouveau post - remplacé par le composant CreatePost */}
        {isAuthenticated && (
            <CreatePost onPostCreated={handlePostCreated} />
        )}

        {/* Affichage des posts */}
        <div className="mt-5 space-y-4">
          {isLoading ? (
              <div className="text-center p-4">Chargement des posts...</div>
          ) : posts.length === 0 ? (
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-gray-700">
                Aucun post à afficher.
                {feedType === "personal" && " Commencez à suivre des utilisateurs pour voir leurs posts."}
              </div>
          ) : (
              formatPosts(posts).map((post, index) => (
                  <Post key={post.id || index} {...post} />
              ))
          )}
        </div>
      </div>
  );
}