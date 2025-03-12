import React, { useState } from "react";
import { Heart, MessageCircle, Repeat2 } from "lucide-react";
import PostService from "../services/postService";
import { useNavigate } from "react-router-dom";

interface PostUser {
  avatar: string;
  name: string;
  username: string;
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
  isReposted?: boolean;
}

const Post: React.FC<PostProps> = ({
  id,
  user,
  content,
  time,
  comments = 0,
  likes = 0,
  shares = 0,
  isLiked = false,
  isReposted = false,
}) => {
  const navigate = useNavigate();
  const [isLikedState, setIsLikedState] = useState(isLiked);
  const [isRepostedState, setIsRepostedState] = useState(isReposted);
  const [likeCount, setLikeCount] = useState(likes);
  const [sharesCount, setSharesCount] = useState(shares);

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation au parent (navigation)

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

  const handleRepostClick = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Empêche la propagation au parent (navigation)

    try {
      if (id) {
        await PostService.toggleRepost(id);
        setIsRepostedState(!isRepostedState);
        setSharesCount(isRepostedState ? sharesCount - 1 : sharesCount + 1);
      }
    } catch (error) {
      console.error("Erreur lors du toggle du repost :", error);
    }
  };

  const handlePostClick = () => {
    if (id) {
      navigate(`/post/${id}`);
    }
  };

  return (
    <div
      className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 cursor-pointer hover:bg-opacity-80 transition-all"
      onClick={handlePostClick}
    >
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
              <MessageCircle size={18} /> <span>{comments}</span>
            </div>
            <div
              className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
              onClick={handleRepostClick}
            >
              <Repeat2
                size={18}
                className={isRepostedState ? "text-[var(--accent)]" : ""}
              />
              <span>{sharesCount}</span>
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
  );
};

export default Post;