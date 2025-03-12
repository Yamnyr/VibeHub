import axios, { AxiosRequestConfig } from "axios";

// Définition des types
export interface PostComment {
    id: number;
    user: string;
    text: string;
}

// Mise à jour de l'interface Post pour tenir compte des likes et reposts en tant que tableaux d'IDs
export interface Post {
    _id: string;
    userId: {
        _id: string;
        username: string;
        profileImage: string;
    };
    content: string;
    createdAt: string;
    comments: PostComment[];
    commentsCount: number;  // Nombre de commentaires
    likesCount: number;     // Nombre de likes
    repostsCount: number;   // Nombre de reposts
    likes: string[];        // Liste des IDs des utilisateurs qui ont liké
    reposts: string[];      // Liste des IDs des utilisateurs qui ont reposté
    isLiked: boolean;       // Indique si l'utilisateur actuel a liké le post
    isReposted: boolean;    // Indique si l'utilisateur actuel a reposté le post
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Service pour les feeds
export const FeedService = {
    // Récupérer le feed personnalisé (posts des utilisateurs suivis)
    getUserFeed: async (): Promise<Post[]> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/feed`, {
                headers: {
                    'Authorization': token ? `Bearer ${token}` : '',
                } as AxiosRequestConfig['headers'],
            });

            // Ajouter isLiked et isReposted pour chaque post en fonction de l'utilisateur connecté
            const userId = localStorage.getItem("userId"); // Assurez-vous que l'ID de l'utilisateur est stocké
            const posts = response.data.map((post: Post) => ({
                ...post,
                isLiked: post.likes.includes(userId ?? ""),  // Vérifier si l'utilisateur a liké
                isReposted: post.reposts.includes(userId ?? ""), // Vérifier si l'utilisateur a reposté
            }));

            return posts;
        } catch (error) {
            console.error("Erreur lors de la récupération du feed personnalisé:", error);
            throw error;
        }
    },

    // Récupérer le feed global (tous les posts)
    getGlobalFeed: async (): Promise<Post[]> => {
        try {
            const response = await axios.get(`${API_URL}/feed/global`);

            // Ajouter isLiked et isReposted pour chaque post en fonction de l'utilisateur connecté
            const userId = localStorage.getItem("userId"); // Assurez-vous que l'ID de l'utilisateur est stocké
            const posts = response.data.map((post: Post) => ({
                ...post,
                // isLiked: post.likes.includes(userId ?? ""),  // Vérifier si l'utilisateur a liké
                // isReposted: post.reposts.includes(userId ?? ""), // Vérifier si l'utilisateur a reposté
            }));
            console.log(posts)
            return posts;
        } catch (error) {
            console.error("Erreur lors de la récupération du feed global:", error);
            throw error;
        }
    },

    // Créer un nouveau post
    createPost: async (content: string): Promise<Post> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/posts`,
                { content },
                {
                    headers: {
                        'Authorization': token ? `Bearer ${token}` : '',
                    } as AxiosRequestConfig['headers'],
                }
            );
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la création du post:", error);
            throw error;
        }
    }
};

export default FeedService;
