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
    loadFeed();
  };

  return (
      <div className="max-w-xl mx-auto mt-5">
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

        {isAuthenticated && (
            <CreatePost onPostCreated={handlePostCreated} />
        )}

        <div className="mt-5 space-y-4">
          {isLoading ? (
              <div className="text-center p-4">Chargement des posts...</div>
          ) : posts.length === 0 ? (
              <div className="text-center p-4 bg-[var(--bg-secondary)] rounded-lg border border-gray-700">
                Aucun post à afficher.
                {feedType === "personal" && " Commencez à suivre des utilisateurs pour voir leurs posts."}
              </div>
          ) : (
              posts.map((post) => (
                  <Post key={post._id} id={post._id} />
              ))
          )}
        </div>
      </div>
  );
}