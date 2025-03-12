import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, MessageCircle, Repeat2, ArrowLeft } from "lucide-react";
import PostService, { Post as PostType } from "../services/postService";

interface Comment {
  _id: string;
  userId: {
    _id: string;
    username: string;
    profileImage: string;
  };
  content: string;
  createdAt: string;
}

const PostDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [post, setPost] = useState<PostType | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [isLikedState, setIsLikedState] = useState(false);
  const [isRepostedState, setIsRepostedState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [shareCount, setShareCount] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchPostDetails = async () => {
      setIsLoading(true);
      try {
        // Charger les détails du post
        const postData = await PostService.getPostById(id);
        setPost(postData);
        setIsLikedState(postData.isLiked || false);
        setIsRepostedState(postData.isReposted || false);
        setLikeCount(postData.likes?.length || 0);
        setShareCount(postData.reposts?.length || 0);

        // Charger les commentaires
        const commentsData = await PostService.getPostComments(id);
        setComments(commentsData);
      } catch (error) {
        console.error("Erreur lors du chargement des détails du post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [id]);

  const handleFavoriteClick = async () => {
    try {
      if (id) {
        await PostService.toggleFavorite(id);
        setIsLikedState(!isLikedState);
        setLikeCount(isLikedState ? likeCount - 1 : likeCount + 1);
      }
    } catch (error) {
      console.error("Erreur lors du toggle des favoris :", error);
    }
  };

  const handleRepostClick = async () => {
    try {
      if (id) {
        await PostService.toggleRepost(id);
        setIsRepostedState(!isRepostedState);
        setShareCount(isRepostedState ? shareCount - 1 : shareCount + 1);
      }
    } catch (error) {
      console.error("Erreur lors du toggle du repost :", error);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newComment.trim() || !id) return;

    try {
      // Créer le FormData pour le commentaire
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append("parentId", id);

      // Appel au service pour créer le commentaire
      await PostService.createPost(formData);

      // Réinitialiser le champ du commentaire
      setNewComment("");

      // Recharger les commentaires
      const updatedComments = await PostService.getPostComments(id);
      setComments(updatedComments);
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}j`;
  };

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto mt-5 p-4 text-center">
        Chargement du post...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-xl mx-auto mt-5 bg-[var(--bg-secondary)] p-4 rounded-lg border border-gray-700">
        Post introuvable
        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-[var(--accent)] text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-5">
      {/* Bouton de retour */}
      <button
        onClick={() => navigate(-1)}
        className="mb-4 text-[var(--accent)] flex items-center"
      >
        <ArrowLeft size={18} className="mr-1" /> Retour
      </button>

      {/* Post principal */}
      <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 mb-4">
        <div className="flex space-x-4">
          <img
            src={post.userId.profileImage || "/placeholder.svg"}
            alt={post.userId.username}
            className="w-12 h-12 rounded-full"
          />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[var(--text-primary)]">{post.userId.username}</span>
              <span className="text-gray-500 text-sm">
                @{post.userId.username} · {formatTime(post.createdAt)}
              </span>
            </div>
            <p className="text-[var(--text-primary)] mt-2">{post.content}</p>

            {/* Icônes d'interaction */}
            <div className="flex justify-between text-gray-500 mt-3 text-sm">
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                <MessageCircle size={18} /> <span>{comments.length}</span>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                onClick={handleRepostClick}
              >
                <Repeat2
                  size={18}
                  className={isRepostedState ? "text-[var(--accent)]" : ""}
                />
                <span>{shareCount}</span>
              </div>
              <div
                className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                onClick={handleFavoriteClick}
              >
                <Heart
                  size={18}
                  className={isLikedState ? "text-red-500" : ""}
                />
                <span>{likeCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Formulaire de commentaire */}
      <form onSubmit={handleCommentSubmit} className="mb-4 bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4">
        <div className="flex">
          <input
            type="text"
            placeholder="Ajouter un commentaire..."
            className="flex-1 bg-transparent border-b border-gray-700 focus:border-[var(--accent)] focus:outline-none text-[var(--text-primary)] py-2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button
            type="submit"
            className="ml-2 px-3 bg-[var(--accent)] text-white rounded-lg disabled:opacity-50"
            disabled={!newComment.trim()}
          >
            Commenter
          </button>
        </div>
      </form>

      {/* Liste des commentaires */}
      <div className="space-y-4">
        <h2 className="text-[var(--text-primary)] font-bold text-xl">Commentaires ({comments.length})</h2>

        {comments.length === 0 ? (
          <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 text-center text-gray-500">
            Aucun commentaire pour le moment
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment._id} className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4">
              <div className="flex space-x-3">
                <img
                  src={comment.userId.profileImage || "/placeholder.svg"}
                  alt={comment.userId.username}
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-[var(--text-primary)]">{comment.userId.username}</span>
                    <span className="text-gray-500 text-xs">
                      @{comment.userId.username} · {formatTime(comment.createdAt)}
                    </span>
                  </div>
                  <p className="text-[var(--text-primary)]">{comment.content}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostDetail;