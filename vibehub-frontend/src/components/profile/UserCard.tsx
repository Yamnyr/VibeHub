import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from "../../services/profileService";
import authService from "../../services/authService";
import AvatarPlaceholder from "../../components/Avatar";

interface UserCardProps {
    user: User;
    handleToggleFollow: (userId: string) => void;
    isFollowing?: boolean;
}

const UserCard: React.FC<UserCardProps> = ({ user, handleToggleFollow, isFollowing }) => {
    const navigate = useNavigate();
    const currentUser = authService.getCurrentUser()?.user;
    const isUserCurrentUser = currentUser?._id === user._id;

    // Si isFollowing n'est pas explicitement fourni, on essaie de le déterminer
    const userIsFollowed = isFollowing !== undefined
        ? isFollowing
        : currentUser?.following?.some(f => f === user._id) || false;

    const handleCardClick = () => {
        navigate(`/profile/${user._id}`);
    };

    const handleFollowClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Empêche la navigation quand on clique sur le bouton
        handleToggleFollow(user._id);
    };

    return (
        <div
            className="bg-[var(--bg-secondary)] border border-gray-700 rounded-lg p-4 mt-4 flex items-center justify-between cursor-pointer hover:bg-opacity-80 transition-all"
            onClick={handleCardClick}
        >
            <div className="flex items-center space-x-3">
                <AvatarPlaceholder src={user.profilePicture} size="medium" />
                <div>
                    <h4 className="font-bold text-[var(--text-primary)]">{user.username}</h4>
                    <p className="text-gray-500">@{user.username}</p>
                    <p className="text-[var(--text-primary)] text-sm mt-1">{user.bio || "Pas de bio"}</p>
                </div>
            </div>

            {/*{!isUserCurrentUser && (*/}
            {/*    <button*/}
            {/*        onClick={handleFollowClick}*/}
            {/*        className={`px-4 py-1 rounded-full ${*/}
            {/*            userIsFollowed*/}
            {/*                ? 'bg-transparent border border-[var(--accent)] text-[var(--accent)]'*/}
            {/*                : 'bg-[var(--accent)] text-white'*/}
            {/*        } hover:opacity-80 transition-opacity`}*/}
            {/*    >*/}
            {/*        {userIsFollowed ? 'Abonné' : 'Suivre'}*/}
            {/*    </button>*/}
            {/*)}*/}
        </div>
    );
};

export default UserCard;