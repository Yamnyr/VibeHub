import { useAuth } from "../context/AuthContext.tsx";
import { LogOut } from "lucide-react";
import Post from "../components/Post"; // Importation du composant Post
import { useState } from "react";

export default function Accueil() {
  const [newPost, setNewPost] = useState<string>("");

  // Données des posts avec commentaires
  const posts = [
    {
      user: {
        avatar: "https://via.placeholder.com/50",
        name: "John Doe",
        username: "johndoe",
      },
      content: "Ceci est mon premier post ! 🚀",
      time: "2h",
      comments: [
        { id: 1, user: "Alice", text: "Super post ! 🔥" },
        { id: 2, user: "Bob", text: "Félicitations ! 👏" },
        { id: 3, user: "Charlie", text: "Impressionnant 💯" },
        { id: 4, user: "David", text: "J’adore ! 😍" },
        { id: 5, user: "Eve", text: "Trop cool ! 😎" },
      ],
    },
    {
      user: {
        avatar: "https://via.placeholder.com/50",
        name: "Alice Smith",
        username: "alice_smith",
      },
      content: "React + Tailwind = ❤️",
      time: "5h",
      comments: [
        { id: 1, user: "John", text: "C'est trop bien !" },
        { id: 2, user: "Bob", text: "Totalement d'accord ! 😃" },
        { id: 3, user: "Charlie", text: "J'adore aussi React 🚀" },
        { id: 4, user: "David", text: "Tailwind, c'est top aussi ! 🎨" },
      ],
    },
  ];

  return (
    <div className="max-w-xl mx-auto mt-5">
      {/* Input pour créer un nouveau post */}
      <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-gray-700">
        <textarea
          className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
          placeholder="Quoi de neuf ?"
          rows={3}
          value={newPost}
          onChange={(e) => setNewPost(e.target.value)}
        />
        <button
          className="mt-3 w-full bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white font-bold py-2 rounded-lg transition-colors"
        >
          Poster
        </button>
      </div>

      {/* Affichage des posts avec commentaires */}
      <div className="mt-5 space-y-4">
        {posts.map((post, index) => (
          <Post key={index} {...post} />
        ))}
      </div>
    </div>
  );
}
