import axios, { type AxiosRequestConfig } from "axios";

// ✅ Définition des types
export interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    banner?: string;
    bio?: string;
    followers: string[]; // Liste des IDs des abonnés
    following: string[]; // Liste des IDs des abonnements
}

export interface Post {
    _id: string
    userId: User
    content: string
    media?: string[]
    hashtags?: string[]
    createdAt: string
    updatedAt: string
    comments: number
    likes: string[]  // Liste des IDs des utilisateurs ayant liké
    reposts: string[] // Liste des IDs des utilisateurs ayant reposté
    parentId?: string
    isLiked?: boolean // Indique si l'utilisateur connecté a liké
    isReposted?: boolean // Indique si l'utilisateur connecté a reposté
}

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ✅ Service pour les utilisateurs (Profile)
const ProfileService = {
    // ✅ Récupérer un utilisateur par ID
    getUserById: async (userId: string): Promise<User> => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Récupérer un utilisateur par username
    getUserByUsername: async (username: string): Promise<User> => {
        try {
            const response = await axios.get(`${API_URL}/users/profile/${username}`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération de l'utilisateur ${username}:`, error);
            throw error;
        }
    },

    // ✅ Mettre à jour le profil de l'utilisateur connecté
    updateProfile: async (userData: Partial<User>): Promise<User> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.put(`${API_URL}/users/profile`, userData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
            return response.data.user;
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du profil:`, error);
            throw error;
        }
    },

    // ✅ Récupérer les posts d'un utilisateur
    getUserPosts: async (userId: string): Promise<Post[]> => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}/posts`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des posts de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Récupérer les posts likés par un utilisateur
    getUserLikes: async (userId: string): Promise<Post[]> => {
        try {
            // ✅ Récupère tous les posts de l'utilisateur
            const response = await axios.get(`${API_URL}/users/${userId}/posts`);
            const allPosts: Post[] = response.data;
    
            // ✅ Filtrer les posts qui contiennent `userId` dans `likes`
            const likedPosts = allPosts.filter(post => post.likes.includes(userId));
    
            return likedPosts;
        } catch (error) {
            console.error(`Erreur lors de la récupération des likes de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },    

    // ✅ Récupérer les reposts d'un utilisateur
    getUserReposts: async (userId: string): Promise<Post[]> => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}/reposts`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des reposts de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Récupérer les abonnés d'un utilisateur
    getUserFollowers: async (userId: string): Promise<User[]> => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}/followers`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des abonnés de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Récupérer les abonnements d'un utilisateur
    getUserFollowing: async (userId: string): Promise<User[]> => {
        try {
            const response = await axios.get(`${API_URL}/users/${userId}/following`);
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la récupération des abonnements de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Suivre un utilisateur
    followUser: async (userId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/users/${userId}/follow`, {}, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
        } catch (error) {
            console.error(`Erreur lors du follow de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Se désabonner d'un utilisateur
    unfollowUser: async (userId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`${API_URL}/users/${userId}/follow`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
        } catch (error) {
            console.error(`Erreur lors de l'unfollow de l'utilisateur ${userId}:`, error);
            throw error;
        }
    },

    // ✅ Rechercher des utilisateurs
    searchUsers: async (query: string): Promise<User[]> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/users/search?query=${query}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
            return response.data;
        } catch (error) {
            console.error(`Erreur lors de la recherche d'utilisateurs avec "${query}":`, error);
            throw error;
        }
    },
};

export default ProfileService;
