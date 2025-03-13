import React from 'react';
import { useRef } from "react";
import UserProfile from "./UserProfile.tsx";
import { User as UserIcon } from "lucide-react";
import Webcam from "react-webcam";

const AvatarPlaceholder = ({ src, size = "w-24 h-24" }: { src?: string; size?: string }) => {
    const webcamRef = useRef<Webcam>(null);
    return (
        <div className={`${size} rounded-full border-4 border-[var(--bg-secondary)] flex items-center justify-center overflow-hidden bg-gray-300`}>
            {src ? (
                <img src={src} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
                <Webcam ref={webcamRef} className='transform scale-[1.35]
            ' screenshotFormat="image/jpeg"  />

            )}
        </div>
    );
};

export default AvatarPlaceholder;
