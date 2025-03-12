import React from 'react';
import UserProfile from "./UserProfile.tsx";
import { User as UserIcon } from "lucide-react";

const AvatarPlaceholder = ({ src, size = "w-24 h-24" }: { src?: string; size?: string }) => {
    return (
        <div className={`${size} rounded-full border-4 border-[var(--bg-secondary)] flex items-center justify-center overflow-hidden bg-gray-300`}>
            {src ? (
                <img src={src} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <UserIcon size={48} className="text-gray-500" />
            )}
        </div>
    );
};

export default AvatarPlaceholder;
