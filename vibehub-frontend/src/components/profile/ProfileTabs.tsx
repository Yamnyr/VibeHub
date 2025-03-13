// ProfileTabs.tsx
import React from 'react';

interface ProfileTabsProps {
    activeTab: 'posts' | 'likes' | 'reposts' | 'savedPosts' | 'followers' | 'following';
    setActiveTab: (tab: 'posts' | 'likes' | 'reposts' | 'savedPosts' | 'followers' | 'following') => void;
    isCurrentUser: boolean;
}

const ProfileTabs: React.FC<ProfileTabsProps> = ({ activeTab, setActiveTab, isCurrentUser }) => {
    return (
        <div className="mt-6 border-b border-gray-700">
            <nav className="flex flex-wrap">
                <TabButton
                    label="Posts"
                    isActive={activeTab === 'posts'}
                    onClick={() => setActiveTab('posts')}
                />
                <TabButton
                    label="Likes"
                    isActive={activeTab === 'likes'}
                    onClick={() => setActiveTab('likes')}
                />
                <TabButton
                    label="Reposts"
                    isActive={activeTab === 'reposts'}
                    onClick={() => setActiveTab('reposts')}
                />
                {isCurrentUser && (
                    <TabButton
                        label="Signets"
                        isActive={activeTab === 'savedPosts'}
                        onClick={() => setActiveTab('savedPosts')}
                    />
                )}
            </nav>
        </div>
    );
};

interface TabButtonProps {
    label: string;
    isActive: boolean;
    onClick: () => void;
}

const TabButton: React.FC<TabButtonProps> = ({ label, isActive, onClick }) => (
    <button
        onClick={onClick}
        className={`px-4 py-2 font-medium ${isActive
            ? 'text-[var(--accent)] border-b-2 border-[var(--accent)]'
            : 'text-gray-500 hover:text-[var(--text-primary)]'}`}
    >
        {label}
    </button>
);

export default ProfileTabs;