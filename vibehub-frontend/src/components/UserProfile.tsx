import React from "react";
import { useAuth } from "../context/AuthContext.tsx";
import AvatarPlaceholder from "../components/Avatar.tsx";
import { User as UserIcon } from "lucide-react";
import AvatarCamPlaceholder from "./AvatarCam.tsx";

const UserProfile = () => {
  const { user } = useAuth();

  // ✅ Vérification si `user` est null ou non défini
  if (!user) {
    return <div className="text-center text-gray-500">Chargement...</div>;
  }

  return (
<div className="bg-secondary border-b-2 p-3">
        {/* ✅ Conteneur principal en colonne */}
        <div className="flex flex-col items-center text-center">
            
            {/* ✅ Profil avec Avatar et Infos utilisateur */}
            <div className="flex items-center space-x-4">
                <AvatarCamPlaceholder size="w-48 h-48" />
                {/* ✅ Informations utilisateur à droite */}
                
                  
            </div>
            <p><h2 className="text-xl font-bold text-white">{user.username}</h2></p>
                    <p className="text-gray-400 text-sm">@{user.username}</p>
                    {/* <UserIcon size={48} className="text-gray-500" /> */}
        {/* Email */}
        <p className="text-sm text-gray-300 mb-4">{user.email}</p>

        {/* Stats */}
        <div className="flex justify-center space-x-6 text-sm">
          {[
            { label: "Followers", value: user.followers?.length || 0 },
            { label: "Following", value: user.following?.length || 0 },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <span className="text-gray-400">{stat.label}</span>
              <br />
              <span className="font-bold text-white">{stat.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
