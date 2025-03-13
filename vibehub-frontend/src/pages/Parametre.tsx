import { useAuth } from "../context/AuthContext.tsx";
import { LogOut, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import authService from "../services/authService";
import Avatar from "../components/Avatar.tsx";

export default function Parametre() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.profilePicture || "https://via.placeholder.com/100");
  const [banner, setBanner] = useState(user?.banner || "https://via.placeholder.com/300x100");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);

  useEffect(() => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setAvatar(user?.profilePicture || "https://via.placeholder.com/100");
    setBanner(user?.banner || "https://via.placeholder.com/300x100");
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await authService.updateProfile({
        username,
        bio,
        profilePicture: selectedAvatar || undefined,
        banner: selectedBanner || undefined
      });

      alert("Modifications enregistrées !");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      alert("Erreur lors de la mise à jour !");
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedAvatar(file);
      setAvatar(URL.createObjectURL(file)); // Prévisualisation

    }
  };

  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedBanner(file);
      setBanner(URL.createObjectURL(file)); // Prévisualisation
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-5 bg-[var(--bg-secondary)] p-6 rounded-lg border border-gray-700">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Paramètres</h1>

      {/* Bannière */}
      <div className="relative w-full h-32 mb-6">
        <img src={banner} alt="Banner" className="w-full h-full object-cover rounded-lg border border-gray-500" />
        <label className="absolute bottom-2 right-2 bg-[var(--accent)] text-white p-2 rounded-full cursor-pointer">
          <Camera size={16} />
          <input type="file" className="hidden" onChange={handleBannerChange} />
        </label>
      </div>

      {/* Image de profil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img src={avatar} alt="Avatar" className="w-24 h-24 rounded-full border border-gray-500" />
          <label className="absolute bottom-0 right-0 bg-[var(--accent)] text-white p-2 rounded-full cursor-pointer">
            <Camera size={16} />
            <input type="file" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>
        <p className="text-gray-400 text-sm mt-2">Changer la photo de profil</p>
      </div>

      {/* Formulaire */}
      <form onSubmit={handleUpdate} className="space-y-4">
        <div>
          <label className="text-[var(--text-primary)] block mb-1">Nom d'utilisateur</label>
          <input
            type="text"
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <div>
          <label className="text-[var(--text-primary)] block mb-1">Bio</label>
          <textarea
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-2 rounded-lg transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>

      <div className="mt-6 flex justify-center">
        <button
          onClick={logout}
          className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors"
        >
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
