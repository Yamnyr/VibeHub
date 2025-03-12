import axios, { type AxiosRequestConfig } from "axios"

// Définition des types
export interface User {
    _id: string
    username: string
    profileImage: string
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

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api"

// Service pour les posts
const PostService = {
    // Créer un nouveau post
    createPost: async (formData: FormData): Promise<Post> => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/posts`, formData, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                    "Content-Type": "multipart/form-data",
                } as AxiosRequestConfig["headers"],
            });
            return response.data.post;
        } catch (error) {
            console.error("Erreur lors de la création du post:", error);
            throw error;
        }
    },


    // Récupérer un post par son ID
    getPostById: async (postId: string): Promise<Post> => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_URL}/posts/${postId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            })
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la récupération du post ${postId}:`, error)
            throw error
        }
    },

    // Mettre à jour un post existant
    updatePost: async (postId: string, content: string): Promise<Post> => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.put(
                `${API_URL}/posts/${postId}`,
                { content },
                {
                    headers: {
                        Authorization: token ? `Bearer ${token}` : "",
                    } as AxiosRequestConfig["headers"],
                },
            )
            return response.data.post
        } catch (error) {
            console.error(`Erreur lors de la mise à jour du post ${postId}:`, error)
            throw error
        }
    },

    // Supprimer un post
    deletePost: async (postId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token")
            await axios.delete(`${API_URL}/posts/${postId}`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            })
        } catch (error) {
            console.error(`Erreur lors de la suppression du post ${postId}:`, error)
            throw error
        }
    },

    // Récupérer les commentaires d'un post
    getPostComments: async (postId: string): Promise<Post[]> => {
        try {
            const token = localStorage.getItem("token")
            const response = await axios.get(`${API_URL}/posts/${postId}/comments`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            })
            return response.data
        } catch (error) {
            console.error(`Erreur lors de la récupération des commentaires du post ${postId}:`, error)
            throw error
        }
    },

    // Récupérer les utilisateurs ayant liké un post
    getPostLikes: async (postId: string): Promise<User[]> => {
        // Utilisation de la route mise à jour pour récupérer les utilisateurs ayant liké un post
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/posts/${postId}/likes`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
            return response.data; // Liste des utilisateurs ayant liké le post
        } catch (error) {
            console.error(`Erreur lors de la récupération des likes du post ${postId}:`, error);
            throw error;
        }
    },

    // Récupérer les utilisateurs ayant reposté un post
    getPostReposts: async (postId: string): Promise<User[]> => {
        // Utilisation de la route mise à jour pour récupérer les utilisateurs ayant reposté un post
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/posts/${postId}/reposts`, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
            return response.data; // Liste des utilisateurs ayant reposté le post
        } catch (error) {
            console.error(`Erreur lors de la récupération des reposts du post ${postId}:`, error);
            throw error;
        }
    },

    // Ajouter ou retirer un like
    toggleFavorite: async (postId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/posts/${postId}/like`, {}, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
        } catch (error) {
            console.error(`Erreur lors du toggle du favori du post ${postId}:`, error);
            throw error;
        }
    },

    // Ajouter ou retirer un repost
    toggleRepost: async (postId: string): Promise<void> => {
        try {
            const token = localStorage.getItem("token");
            await axios.post(`${API_URL}/posts/${postId}/repost`, {}, {
                headers: {
                    Authorization: token ? `Bearer ${token}` : "",
                } as AxiosRequestConfig["headers"],
            });
        } catch (error) {
            console.error(`Erreur lors du repost du post ${postId}:`, error);
            throw error;
        }
    }
}

export default PostService;
