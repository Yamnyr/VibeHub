import React from 'react';

const UserProfile = () => {
  return (
    <div className="bg-secondary p-4 border-b-2">
      <div className="flex flex-col items-center text-center">
        <div className="flex items-center space-x-3 mb-3">
          <img
            src="https://img.freepik.com/premium-vector/avatar-profile-icon-flat-style-female-user-profile-vector-illustration-isolated-background-women-profile-sign-business-concept_157943-38866.jpg?semt=ais_hybrid"
            alt="John Doe"
            className="w-16 h-16 rounded-full"
          />
          <div className="text-left">
            <h2 className="text-lg font-bold">John Doe</h2>
            <p className="text-secondary text-sm">@johndoe</p>
          </div>
        </div>

        <p className="text-sm mb-4">
          Passionné de développement web et amateur de café.
        </p>

        <div className="flex justify-center space-x-6 text-sm">
          {[
            { label: "Posts", value: 120 },
            { label: "Followers", value: 450 },
            { label: "Following", value: 180 },
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
