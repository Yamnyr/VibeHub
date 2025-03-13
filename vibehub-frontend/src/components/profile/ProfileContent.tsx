import React from 'react';
import { User, Post as PostType } from "../../services/profileService";
import Post from "../../components/Post.tsx";
import UserCard from './UserCard';
import authService from "../../services/authService";

interface ProfileContentProps {
    activeTab: 'posts' | 'likes' | 'reposts' | 'savedPosts' | 'followers' | 'following';
    posts: PostType[];
    likes: PostType[];
    reposts: PostType[];
    savedPosts: PostType[];
    followers: User[];
    following: User[];
    isCurrentUser: boolean;
    handleToggleFollow: (userId: string) => void;
    isFollowing?: boolean;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
                                                           activeTab,
                                                           posts,
                                                           likes,
                                                           reposts,
                                                           savedPosts,
                                                           followers,
                                                           following,
                                                           isCurrentUser,
                                                           handleToggleFollow,
                                                           isFollowing
                                                       }) => {
    return (
        <div className="mt-4">
            {activeTab === 'posts' && (
                <PostSection
                    title="Posts"
                    posts={posts}
                    emptyMessage="Aucun post pour l'instant."
                />
            )}

            {activeTab === 'likes' && (
                <PostSection
                    title="Likes"
                    posts={likes}
                    emptyMessage="Aucun post liké pour l'instant."
                />
            )}

            {activeTab === 'reposts' && (
                <PostSection
                    title="Reposts"
                    posts={reposts}
                    emptyMessage="Aucun repost pour l'instant."
                />
            )}

            {isCurrentUser && activeTab === 'savedPosts' && (
                <PostSection
                    title="Signets"
                    posts={savedPosts}
                    emptyMessage="Aucun post enregistré pour l'instant."
                />
            )}

            {activeTab === 'followers' && (
                <UserSection
                    title="Abonnés"
                    users={followers}
                    emptyMessage="Aucun abonné pour l'instant."
                    handleToggleFollow={handleToggleFollow}
                />
            )}

            {activeTab === 'following' && (
                <UserSection
                    title="Abonnements"
                    users={following}
                    emptyMessage="Aucun abonnement pour l'instant."
                    handleToggleFollow={handleToggleFollow}
                />
            )}
        </div>
    );
};

interface PostSectionProps {
    title: string;
    posts: PostType[];
    emptyMessage: string;
}

const PostSection: React.FC<PostSectionProps> = ({ title, posts, emptyMessage }) => (
    <>
        <h3 className="text-lg font-bold text-[var(--text-primary)] sr-only">{title}</h3>
        {posts.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-[var(--bg-secondary)] rounded-lg border border-gray-700">
                {emptyMessage}
            </div>
        ) : (
            <div className="space-y-4">
                {posts.map((post) => (
                    <Post key={post._id} id={post._id} />
                ))}
            </div>
        )}
    </>
);

interface UserSectionProps {
    title: string;
    users: User[];
    emptyMessage: string;
    handleToggleFollow: (userId: string) => void;
}

const UserSection: React.FC<UserSectionProps> = ({ title, users, emptyMessage, handleToggleFollow }) => (
    <>
        <h3 className="text-lg font-bold text-[var(--text-primary)]">{title}</h3>
        {users.length === 0 ? (
            <div className="text-center text-gray-500 py-8 bg-[var(--bg-secondary)] rounded-lg border border-gray-700">
                {emptyMessage}
            </div>
        ) : (
            <div>
                {users.map(user => (
                    <UserCard
                        key={user._id}
                        user={user}
                        handleToggleFollow={handleToggleFollow}
                    />
                ))}
            </div>
        )}
    </>
);

export default ProfileContent;