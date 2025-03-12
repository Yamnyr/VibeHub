import React from 'react';
import {useAuth} from "../context/AuthContext.tsx";
import AvatarPlaceholder from '../components/Avatar.tsx'

const UserProfile = () => {
  const { logout, token, user } = useAuth();
  return (
      <div className="bg-secondary  border-b-2">
        <div className="flex flex-col  text-center">
          <div className="flex items-center space-x-3 mb-3">
            <AvatarPlaceholder />
            <div className="text-left">
              <h2 className="text-lg font-bold">{user?.username}</h2>
              <p className="text-secondary text-sm">@{user?.username}</p>
            </div>
          </div>

          <p className="text-sm mb-4">
            {user?.email}
          </p>

          <div className="flex justify-center space-x-6 text-sm">
            {[
              // { label: "Posts", value: 120 },
              { label: "Followers", value: user?.followersCount} ,
              { label: "Following", value: user?.followingCount },
            ].map((stat, i) => (
                <div key={i} className="text-center">
                  <span className="text-secondary">{stat.label}</span>
                  <br />
                  <span className="font-bold">{stat.value}</span>
                </div>
            ))}
          </div>
        </div>
      </div>
  );
};

export default UserProfile;