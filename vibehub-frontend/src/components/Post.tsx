// Dans Post.ProfileTabs.tsx

import React, { useEffect, useState } from "react";
import { Heart, MessageCircle, Repeat2, Bookmark } from "lucide-react";
import PostService from "../services/postService";
import { useNavigate } from "react-router-dom";
import AvatarPlaceholder from "./Avatar.tsx";

// Modifiez l'interface des props pour ne recevoir que l'ID
interface PostProps {
  id: string;
}

const Post: React.FC<PostProps> = ({ id }) => {
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLikedState, setIsLikedState] = useState(false);
  const [isRepostedState, setIsRepostedState] = useState(false);
  const [isSignetedState, setIsSignetedState] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [sharesCount, setSharesCount] = useState(0);
  const [signetsCount, setSignetsCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  // Charger les données du post au chargement du composant
  useEffect(() => {
    const fetchPostData = async () => {
      setIsLoading(true);
      try {
        const postData = await PostService.getPostById(id);
        setPost(postData);
        setIsLikedState(postData.isLiked || false);
        setIsRepostedState(postData.isReposted || false);
        setIsSignetedState(postData.isSigneted || false);
        setLikeCount(postData.likes?.length || 0);
        setSharesCount(postData.reposts?.length || 0);
        setSignetsCount(postData.signets?.length || 0);
        setCommentsCount(postData.comments?.length || 0);
      } catch (error) {
        console.error("Erreur lors du chargement du post:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostData();
  }, [id]);

  // Fonction pour formater le temps (inchangée)
  const formatTime = (date: Date): string => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds}s`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
    return `${Math.floor(diffInSeconds / 86400)}j`;
  };

  // Fonction pour déterminer si un média est une vidéo (inchangée)
  const isVideo = (url: string) => {
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi'];
    return videoExtensions.some(ext => url.toLowerCase().endsWith(ext));
  };

  // Les gestionnaires d'événements restent en grande partie inchangés
  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await PostService.toggleFavorite(id);
      setIsLikedState(!isLikedState);
      setLikeCount(isLikedState ? likeCount - 1 : likeCount + 1);
    } catch (error) {
      console.error("Erreur lors du toggle des favoris :", error);
    }
  };

  const handleRepostClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await PostService.toggleRepost(id);
      setIsRepostedState(!isRepostedState);
      setSharesCount(isRepostedState ? sharesCount - 1 : sharesCount + 1);
    } catch (error) {
      console.error("Erreur lors du toggle du repost :", error);
    }
  };

  const handleSignetClick = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await PostService.toggleSignet(id);
      setIsSignetedState(!isSignetedState);
      setSignetsCount(isSignetedState ? signetsCount - 1 : signetsCount + 1);
    } catch (error) {
      console.error("Erreur lors du toggle du signet :", error);
    }
  };

  // Fonction pour obtenir l'URL complète d'un média (inchangée)
  const getMediaUrl = (url: string) => {
    if (url.startsWith('http') || url.startsWith('https')) {
      return url;
    }
    const API_URL = "http://localhost:5000/";
    return `${API_URL}${url}`;
  };

  const handleProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post && post.userId) {
      navigate(`/profile/${post.userId._id}`);
    }
  };

  const handlePostClick = () => {
    navigate(`/post/${id}`);
  };

  // Afficher un état de chargement pendant que les données sont récupérées
  if (isLoading) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 text-center">
          Chargement du post...
        </div>
    );
  }

  // Si post est null ou undefined après le chargement, quelque chose s'est mal passé
  if (!post) {
    return (
        <div className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 text-center">
          Impossible de charger le post.
        </div>
    );
  }

  return (
      <div
          className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-all"
          onClick={handlePostClick}
      >
        <div className="flex space-x-4">
          <div onClick={handleProfileClick} className="cursor-pointer">
            <AvatarPlaceholder src={"http://localhost:5000/" + post.userId.profilePicture} size="w-16 h-16"/>
          </div>

          <div className="flex-1">
            <div className="flex items-center space-x-2">
            <span className="font-bold text-[var(--text-primary)]">
              {post.userId.username}
            </span>
              <span className="text-gray-500 text-sm">
              @{post.userId.username} · {formatTime(new Date(post.createdAt))}
            </span>
            </div>
            <p className="text-[var(--text-primary)] mt-2">{post.content}</p>

            {/* Affichage des médias */}
            {post.media && post.media.length > 0 && (
                <div className={`grid gap-2 mt-3 ${post.media.length > 1 ? "grid-cols-2" : "grid-cols-1"}`}>
                  {post.media.map((url: string, index: number) => {
                    const fullUrl = getMediaUrl(url);
                    return (
                        <div key={index} className="overflow-hidden rounded-lg border border-gray-600">
                          {isVideo(fullUrl) ? (
                              <video controls className="w-full h-auto rounded-lg">
                                <source src={fullUrl} type={`video/${fullUrl.split('.').pop()}`}/>
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
                <MessageCircle size={18}/> <span>{commentsCount}</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                   onClick={handleRepostClick}>
                <Repeat2 size={18} className={isRepostedState ? "text-[var(--accent)]" : ""}/>
                <span>{sharesCount}</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                   onClick={handleFavoriteClick}>
                <Heart size={18} className={isLikedState ? "text-red-500" : ""}/>
                <span>{likeCount}</span>
              </div>
              <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                   onClick={handleSignetClick}>
                <Bookmark size={18} className={isSignetedState ? "text-[var(--accent)]" : ""}/>
                <span>{signetsCount}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default Post;