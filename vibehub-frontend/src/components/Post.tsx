import React, { useState } from "react";
import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

interface PostProps {
  user: {
    avatar: string;
    name: string;
    username: string;
  };
  content: string;
  time: string;
  comments: { id: number; user: string; text: string }[];
}

const Post: React.FC<PostProps> = ({ user, content, time, comments }) => {
  const [visibleComments, setVisibleComments] = useState(2);
  const [expanded, setExpanded] = useState(false);

  const showMore = () => {
    setVisibleComments(comments.length);
    setExpanded(true);
  };

  const showLess = () => {
    setVisibleComments(2);
    setExpanded(false);
  };

  return (
    <div className="border-b border-gray-700 p-4">
      {/* Post principal */}
      <div className="flex space-x-4">
        <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-[var(--text-primary)]">{user.name}</span>
            <span className="text-gray-500 text-sm">@{user.username} · {time}</span>
          </div>
          <p className="text-[var(--text-primary)] mt-2">{content}</p>

          {/* Icônes d'interaction */}
          <div className="flex justify-between text-gray-500 mt-3 text-sm">
            <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
              <MessageCircle size={18} /> <span>{comments.length}</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
              <Repeat2 size={18} /> <span>5</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
              <Heart size={18} /> <span>30</span>
            </div>
            <div className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]">
              <Share size={18} />
            </div>
          </div>

          {/* Commentaires */}
          <div className="mt-4">
            {comments.slice(0, visibleComments).map((comment) => (
              <div key={comment.id} className="border-t border-gray-700 pt-3 mt-3">
                <span className="text-[var(--text-primary)] font-bold">{comment.user}</span>
                <p className="text-gray-400 text-sm">{comment.text}</p>
              </div>
            ))}

            {/* Boutons "Voir plus" et "Voir moins" */}
            {comments.length > 2 && (
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
        </div>
      </div>
    </div>
  );
};

export default Post;
