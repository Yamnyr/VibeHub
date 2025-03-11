import { useAuth } from "../context/AuthContext.tsx";
import { LogOut, Camera } from "lucide-react";
import { useState } from "react";

export default function Parametre() {
  const [email, setEmail] = useState("johndoe@example.com");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("johndoe");
  const [avatar, setAvatar] = useState("https://via.placeholder.com/100");

  // Simule la mise à jour des informations
  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mise à jour :", { email, password, username, avatar });
    alert("Modifications enregistrées !");
  };

  // Simule le changement d'image de profil
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setAvatar(URL.createObjectURL(file)); // Prévisualisation de l'image
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-5 bg-[var(--bg-secondary)] p-6 rounded-lg border border-gray-700">
      <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Paramètres</h1>

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
        {/* Changer le nom d'utilisateur */}
        <div>
          <label className="text-[var(--text-primary)] block mb-1">Nom d'utilisateur</label>
          <input
            type="text"
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        {/* Changer l'email */}
        <div>
          <label className="text-[var(--text-primary)] block mb-1">Email</label>
          <input
            type="email"
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Changer le mot de passe */}
        <div>
          <label className="text-[var(--text-primary)] block mb-1">Nouveau mot de passe</label>
          <input
            type="password"
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Bouton de mise à jour */}
        <button
          type="submit"
          className="w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-2 rounded-lg transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>

      {/* Bouton de déconnexion */}
      <div className="mt-6 flex justify-center">
        <button className="flex items-center space-x-2 text-red-400 hover:text-red-300 transition-colors">
          <LogOut size={20} />
          <span>Se déconnecter</span>
        </button>
      </div>
    </div>
  );
}
