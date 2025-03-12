import React, { useState, useEffect } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import PostService from "../services/postService";

interface PostUser {
  avatar: string;
  name: string;
  username: string;
}

interface PostComment {
  id: string;
  user: PostUser;
  content: string;
  time: string;
  replies?: PostComment[];
}

interface PostProps {
  id?: string;
  user: PostUser;
  content: string;
  time: string;
  comments?: number;
  likes?: number;
  shares?: number;
  isLiked?: boolean;
  onLikeToggle?: (postId: string) => void;
}

const Post: React.FC<PostProps> = ({
                                     id,
                                     user,
                                     content,
                                     time,
                                     comments = 0,
                                     likes = 0,
                                     shares = 0,
                                     isLiked,
                                     onLikeToggle
                                   }) => {
  const [visibleComments, setVisibleComments] = useState(2);
  const [expanded, setExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [loadedComments, setLoadedComments] = useState<PostComment[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isRepostedState, setIsRepostedState] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [sharesCount, setSharesCount] = useState(shares);
  console.log(isLiked)
  const handleFavoriteClick = async () => {
    try {
      // Mettre à jour l'état du "like"
      await PostService.toggleFavorite(id);

      // Inverser l'état du like
      setIsLikedState(!isLikedState);
      // Met à jour le compte des likes
      setLikeCount(isLikedState ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Erreur lors du toggle des favoris :", error);
    }
  };

  const handleRepostClick = async () => {
    try {
      // Mettre à jour l'état du "repost"
      await PostService.toggleRepost(id);
      setIsRepostedState(!isRepostedState); // Inverse l'état du repost
      setSharesCount(isRepostedState ? sharesCount - 1 : sharesCount + 1); // Met à jour le compte des reposts
    } catch (error) {
      console.error("Erreur lors du toggle du repost :", error);
    }
  };

  const loadComments = async () => {
    if (!id) return;

    setIsLoading(true);
    try {
      const commentsData = await PostService.getPostComments(id);

      // Format comments for display
      const formattedComments = commentsData.map((comment) => ({
        id: comment._id,
        user: {
          avatar: comment.userId.profileImage || "https://via.placeholder.com/50",
          name: comment.userId.username,
          username: comment.userId.username,
        },
        content: comment.content,
        time: formatTime(new Date(comment.createdAt)),
      }));

      setLoadedComments(formattedComments);
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}j`;
  };

  const showMore = () => {
    setVisibleComments(loadedComments.length);
    setExpanded(true);
  };

  const showLess = () => {
    setVisibleComments(2);
    setExpanded(false);
  };

  const handleCommentSubmit = async (e: React.FormEvent, parentCommentId?: string) => {
    e.preventDefault();

    if (!newComment.trim() || !id) return;

    try {
      // Si on répond à un commentaire, on utilise son ID comme parentId
      // Sinon, on utilise l'ID du post principal
      const targetParentId = parentCommentId || id;

      await PostService.createPost(newComment, targetParentId);

      // Réinitialiser le formulaire
      setNewComment("");
      setReplyingTo(null);

      // Recharger les commentaires pour afficher le nouveau
      await loadComments();
    } catch (error) {
      console.error("Erreur lors de l'envoi du commentaire:", error);
    }
  };

  const handleReplyClick = (commentId: string) => {
    setReplyingTo(commentId === replyingTo ? null : commentId);
  };

  useEffect(() => {
    if (id) {
      loadComments();
    }
  }, [id]);

  return (
      <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4">
        {/* Post principal */}
        <div className="flex space-x-4">
          <img src={user.avatar || "/placeholder.svg"} alt={user.name} className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-[var(--text-primary)]">{user.name}</span>
              <span className="text-gray-500 text-sm">
              @{user.username} · {time}
            </span>
            </div>
            <p className="text-[var(--text-primary)] mt-2">{content}</p>

            {/* Icônes d'interaction */}
            <div className="flex justify-between text-gray-500 mt-3 text-sm">
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
                <MessageCircle size={18}/> <span>{comments}</span>
              </div>
              <div
                  className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                  onClick={handleRepostClick}
              >
                <Repeat2 size={18} className={isRepostedState ? "text-[var(--accent)]" : ""} />
                <span>{sharesCount}</span>
              </div>
              <div
                  className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                  onClick={handleFavoriteClick}
              >
                <Heart size={18} className={isLikedState ? "text-red-500" : ""} />
                <span>{likeCount}</span>
              </div>
            </div>

            {/* Formulaire de commentaire principal */}
            <form onSubmit={(e) => handleCommentSubmit(e)} className="mt-4 border-t border-gray-700 pt-3">
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
                  Envoyer
                </button>
              </div>
            </form>

            {/* Commentaires */}
            {isLoading ? (
                <div className="mt-4 text-center text-gray-500">Chargement des commentaires...</div>
            ) : (
                loadedComments.length > 0 && (
                    <div className="mt-4">
                      {loadedComments.slice(0, visibleComments).map((comment) => (
                          <div key={comment.id} className="border-t border-gray-700 pt-3 mt-3">
                            <div className="flex items-start space-x-2">
                              <img
                                  src={comment.user.avatar || "/placeholder.svg"}
                                  alt={comment.user.name}
                                  className="w-8 h-8 rounded-full mt-1"
                              />
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-[var(--text-primary)] font-bold">{comment.user.name}</span>
                                  <span className="text-gray-500 text-xs">
                            @{comment.user.username} · {comment.time}
                          </span>
                                </div>
                                <p className="text-gray-300 text-sm">{comment.content}</p>

                                {/* Bouton pour répondre au commentaire */}
                                <button
                                    onClick={() => handleReplyClick(comment.id)}
                                    className="text-[var(--accent)] text-xs mt-1"
                                >
                                  Répondre
                                </button>

                                {/* Formulaire de réponse au commentaire */}
                                {replyingTo === comment.id && (
                                    <form onSubmit={(e) => handleCommentSubmit(e, comment.id)} className="mt-2">
                                      <div className="flex">
                                        <input
                                            type="text"
                                            placeholder={`Répondre à @${comment.user.username}...`}
                                            className="flex-1 bg-transparent border-b border-gray-700 focus:border-[var(--accent)] focus:outline-none text-[var(--text-primary)] py-1 text-sm"
                                            value={newComment}
                                            onChange={(e) => setNewComment(e.target.value)}
                                        />
                                        <button
                                            type="submit"
                                            className="ml-2 px-2 py-1 bg-[var(--accent)] text-white rounded-lg text-xs disabled:opacity-50"
                                            disabled={!newComment.trim()}
                                        >
                                          Répondre
                                        </button>
                                      </div>
                                    </form>
                                )}
                              </div>
                            </div>
                          </div>
                      ))}

                      {/* Boutons "Voir plus" et "Voir moins" */}
                      {loadedComments.length > 2 && (
                          <div className="mt-2">
                            {!expanded ? (
                                <button onClick={showMore} className="text-[var(--accent)]">
                                  Voir plus
                                </button>
                            ) : (
                                <button onClick={showLess} className="text-[var(--accent)]">
                                  Voir moins
                                </button>
                            )}
                          </div>
                      )}
                    </div>
                )
            )}
          </div>
        </div>
      </div>
  );
};

export default Post;
