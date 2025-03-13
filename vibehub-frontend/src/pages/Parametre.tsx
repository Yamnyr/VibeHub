import { useAuth } from "../context/AuthContext.tsx";
import { LogOut, Camera } from "lucide-react";
import { useState, useEffect } from "react";
import authService from "../services/authService";
import Avatar from "../components/Avatar.tsx";
import ProfileService from "../services/ProfileService";

export default function Parametre() {
  const { user, logout } = useAuth();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/100");
  const [banner, setBanner] = useState("https://via.placeholder.com/300x100");
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [selectedBanner, setSelectedBanner] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const updatedUser = await ProfileService.getUserById(user._id);
        setUsername(updatedUser.username || "");
        setBio(updatedUser.bio || "");
        setAvatar(updatedUser.profilePicture ? `http://localhost:5000/${updatedUser.profilePicture}` : "https://via.placeholder.com/100");
        setBanner(updatedUser.banner ? `http://localhost:5000/${updatedUser.banner}` : "https://via.placeholder.com/300x100");
      } catch (error) {
        console.error("Erreur lors de la récupération des informations utilisateur:", error);
      }
    };
    fetchUserProfile();
  }, [user]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("username", username);
      formData.append("bio", bio);
      if (selectedAvatar) formData.append("profilePicture", selectedAvatar);
      if (selectedBanner) formData.append("banner", selectedBanner);

      await ProfileService.updateProfile(formData);
      setMessage("Modifications enregistrées avec succès !");

      // Rafraîchir les données après la mise à jour
      const updatedUser = await ProfileService.getUserById(user._id);
      setUsername(updatedUser.username || "");
      setBio(updatedUser.bio || "");
      setAvatar(updatedUser.profilePicture ? `http://localhost:5000/${updatedUser.profilePicture}` : "https://via.placeholder.com/100");
      setBanner(updatedUser.banner ? `http://localhost:5000/${updatedUser.banner}` : "https://via.placeholder.com/300x100");
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      setMessage("Erreur lors de la mise à jour !");
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
      setBanner(URL.createObjectURL(file));
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-5 bg-[var(--bg-secondary)] p-6 rounded-lg border border-gray-700">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Paramètres</h1>

      {message && <div className="text-center text-green-500 mb-4">{message}</div>}

      {/* Bannière */}
      <div className="relative w-full h-32 mb-6">
        <img src={selectedBanner ? banner : banner} alt="Banner" className="w-full h-full object-cover rounded-lg border border-gray-500" />
        <label className="absolute bottom-2 right-2 bg-[var(--accent)] text-white p-2 rounded-full cursor-pointer">
          <Camera size={16} />
          <input type="file" className="hidden" onChange={handleBannerChange} />
        </label>
      </div>

      {/* Image de profil */}
      <div className="flex flex-col items-center mb-6">
        <div className="relative">
          <img src={selectedAvatar ? avatar : avatar} alt="Avatar" className="w-24 h-24 rounded-full border border-gray-500" />
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
    </div>
  );
}
