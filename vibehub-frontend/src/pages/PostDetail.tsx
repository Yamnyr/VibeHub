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
        const postData = await PostService.getPostById(id);
        setPost(postData);
        setIsLikedState(postData.isLiked || false);
        setIsRepostedState(postData.isReposted || false);
        setLikeCount(postData.likes?.length || 0);
        setShareCount(postData.reposts?.length || 0);

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
      const formData = new FormData();
      formData.append("content", newComment);
      formData.append("parentId", id);

      await PostService.createPost(formData);

      setNewComment("");

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

  // Fonction pour déterminer si un média est une vidéo
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Fonction pour obtenir l'URL complète d'un média
  const getMediaUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    const API_URL = "http://localhost:5000/";
    return `${API_URL}${url}`;
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

              {/* Affichage des médias */}
              {post.media && post.media.length > 0 && (
                  <div className={`grid gap-2 mt-3 ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {post.media.map((url, index) => {
                      const fullUrl = getMediaUrl(url);
                      return (
                          <div key={index} className="overflow-hidden rounded-lg border border-gray-600">
                            {isVideo(fullUrl) ? (
                                <video controls className="w-full h-auto rounded-lg">
                                  <source src={fullUrl} type={`video/${fullUrl.split('.').pop()}`} />
                                  Votre navigateur ne supporte pas la lecture de vidéos.
                                </video>
                            ) : (
                                <img
                                    src={fullUrl}
                                    alt={`media-${index}`}
                                    className="w-full h-auto object-cover max-h-80"
                                    onClick={(e) => e.stopPropagation()}
                                />
                            )}
                          </div>
                      );
                    })}
                  </div>
              )}

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
                className="ml-2 px-3 py-2 bg-[var(--accent)] text-white rounded-full"
            >
              Envoyer
            </button>
          </div>
        </form>

        {/* Affichage des commentaires */}
        {comments.length > 0 && (
            <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-[var(--text-primary)]">Commentaires</h3>
              <div className="space-y-4 mt-3">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <img
                          src={comment.userId.profileImage || "/placeholder.svg"}
                          alt={comment.userId.username}
                          className="w-8 h-8 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{comment.userId.username}</span>
                          <span className="text-gray-500 text-sm">
                      {formatTime(comment.createdAt)}
                    </span>
                        </div>
                        <p className="mt-1 text-[var(--text-primary)]">{comment.content}</p>
                      </div>
                    </div>
                ))}
              </div>
            </div>
        )}
      </div>
  );
};

export default PostDetail;
