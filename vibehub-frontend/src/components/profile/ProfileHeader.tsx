import React from 'react';
import { User } from "../../services/profileService";
import AvatarPlaceholder from "../../components/Avatar";

interface ProfileHeaderProps {
    user: User;
    isCurrentUser: boolean;
    isFollowing: boolean;
    followersCount: number;
    followingCount: number;
    handleToggleFollow: (userId: string) => void;
    onTabChange: (tab: 'posts' | 'likes' | 'reposts' | 'savedPosts' | 'followers' | 'following') => void;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
                                                         user,
                                                         isCurrentUser,
                                                         isFollowing,
                                                         followersCount,
                                                         followingCount,
                                                         handleToggleFollow,
                                                         onTabChange
                                                     }) => {
    return (
        <>
            {/* Bannière utilisateur */}
            <div className="relative w-full h-40 bg-gray-800 rounded-t-lg">
                {user.banner ? (
                    <img src={user.banner} alt="Bannière" className="w-full h-full object-cover rounded-t-lg" />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500">Pas de bannière</div>
                )}
            </div>

            {/* Profil utilisateur */}
            <div className="relative bg-[var(--bg-secondary)] p-4 rounded-b-lg border-x border-b border-gray-700">
                <div className="-mt-16 flex items-start justify-between">
                    <div className="flex space-x-4">
                        <div className="border-4 border-[var(--bg-secondary)] rounded-full">
                            <AvatarPlaceholder src={user.profilePicture} size="large" />
                        </div>
                        <div className="mt-10">
                            <h2 className="text-xl font-bold text-[var(--text-primary)]">{user.username}</h2>
                            <p className="text-gray-500">@{user.username}</p>
                        </div>
                    </div>

                    {!isCurrentUser && (
                        <button
                            onClick={() => handleToggleFollow(user._id)}
                            className={`mt-10 ${
                                isFollowing
                                    ? 'bg-transparent border border-[var(--accent)] text-[var(--accent)]'
                                    : 'bg-[var(--accent)] text-white'
                            } px-4 py-2 rounded-full hover:opacity-80 transition-opacity`}
                        >
                            {isFollowing ? 'Abonné' : 'Suivre'}
                        </button>
                    )}
                </div>

                <p className="text-[var(--text-primary)] mt-4">{user.bio || "Pas de bio"}</p>

                {/* Stats */}
                <div className="flex space-x-6 text-gray-500 mt-4">
                    <div
                        className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                        onClick={() => onTabChange('following')}
                    >
                        <span className="font-semibold text-[var(--text-primary)]">{followingCount}</span>
                        <span>Abonnements</span>
                    </div>
                    <div
                        className="flex items-center space-x-2 cursor-pointer hover:text-[var(--accent)]"
                        onClick={() => onTabChange('followers')}
                    >
                        <span className="font-semibold text-[var(--text-primary)]">{followersCount}</span>
                        <span>Abonnés</span>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProfileHeader;