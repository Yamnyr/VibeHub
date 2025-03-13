// UserCard.tsx
import React from 'react';
import { User } from "../../services/profileService";
import authService from "../../services/authService";

interface UserCardProps {
    user: User;
    handleToggleFollow: (userId?: string) => void;
}

const UserCard: React.FC<UserCardProps> = ({ user, handleToggleFollow }) => {
    const currentUser = authService.getCurrentUser()?.user;
    const isUserCurrentUser = currentUser?._id === user._id;
    const isUserFollowed = currentUser?.following?.some(f => f._id === user._id) || false;

    return (
        <div
            className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 mt-4 flex items-center space-x-3"
        >
            <img
                src={user.profilePicture || "/placeholder.svg"}
                alt={user.username}
                className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
                <h4 className="font-bold text-[var(--text-primary)]">{user.username}</h4>
                <p className="text-gray-500">@{user.username}</p>
                <p className="text-[var(--text-primary)] text-sm mt-1">{user.bio || "Pas de bio"}</p>
            </div>
            {!isUserCurrentUser && (
                <button
                    onClick={() => handleToggleFollow(user._id)}
                    className={`${
                        isUserFollowed
                            ? 'bg-transparent border border-[var(--accent)] text-[var(--accent)]'
                            : 'bg-[var(--accent)] text-white'
                    } px-3 py-1 rounded-full text-sm hover:opacity-80 transition-opacity`}
                >
                    {isUserFollowed ? 'Ne plus suivre' : 'Suivre'}
                </button>
            )}
        </div>
    );
};

export default UserCard;