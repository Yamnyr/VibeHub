import axios, {AxiosRequestConfig} from 'axios';

// URL de base de l'API - à ajuster selon votre configuration
const API_URL = 'http://localhost:5000/api/users';

// Types des données
interface UserData {
    username: string;
    email: string;
    password: string;
}

interface Credentials {
    email: string;
    password: string;
}

interface AuthResponse {
    token: string;
    user: {
        _id: string;
        username: string;
        email: string;
        profilePicture?: string;
        banner?: string;
        bio?: string;
        followersCount: number;
        followingCount: number;
        [key: string]: any;
    };
}

interface ProfileData {
    username?: string;
    bio?: string;
    profilePicture?: string;
    banner?: string;
    [key: string]: any;
}

// Configuration du stockage du token JWT
const setAuthToken = (token: string | null): void => {
    if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
};

// Service d'authentification
export const authService = {
    // Inscription d'un nouvel utilisateur
    register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
        try {
            const userData: UserData = {
                email,
                password,
                username
            };

            const response = await axios.post(`${API_URL}/register`, userData);

            // Assuming the API returns a token after registration
            const authData: AuthResponse = response.data;
            setAuthToken(authData.token);

            // Store user data in local storage
            localStorage.setItem('user', JSON.stringify(authData.user));

            return authData;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Erreur lors de l\'inscription'
            );
        }
    },

    // Connexion d'un utilisateur
    login: async (email: string, password: string): Promise<AuthResponse> => {
        try {
            const credentials: Credentials = { email, password };
            const response = await axios.post(`${API_URL}/login`, credentials);
            const authData: AuthResponse = response.data;

            // Stocker le token et configurer les en-têtes pour les futures requêtes
            setAuthToken(authData.token);

            return authData;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Identifiants incorrects'
            );
        }
    },

    // Déconnexion de l'utilisateur
    logout: (): void => {
        // Supprimer le token et les informations utilisateur
        setAuthToken(null);
        localStorage.removeItem('user');
    },

    // Vérifier si l'utilisateur est authentifié
    isAuthenticated: (): boolean => {
        return localStorage.getItem('token') !== null;
    },

    // Récupérer l'utilisateur actuel depuis le localStorage
    getCurrentUser: (): AuthResponse | null => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');

        if (user && token) {
            return {
                user: JSON.parse(user),
                token
            };
        }

        return null;
    },

    // Récupérer le profil de l'utilisateur depuis l'API
    fetchUserProfile: async (): Promise<any> => {
        try {
            // Assurez-vous que le token est configuré
            const token = localStorage.getItem('token');
            if (token) {
                setAuthToken(token);
            }

            const response = await axios.get(`${API_URL}/me`);
            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Erreur lors de la récupération du profil'
            );
        }
    },

    updateProfile: async (profileData: ProfileData): Promise<any> => {
        try {
            const formData = new FormData();
            if (profileData.username) formData.append("username", profileData.username);
            if (profileData.bio) formData.append("bio", profileData.bio);
            if (profileData.profilePicture) formData.append("profilePicture", profileData.profilePicture);
            if (profileData.banner) formData.append("banner", profileData.banner);

            const response = await axios.put(`${API_URL}/profile`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });

            // Mettre à jour les informations utilisateur dans localStorage
            if (response.data.user) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error: any) {
            throw new Error(
                error.response?.data?.error ||
                error.response?.data?.message ||
                'Erreur lors de la mise à jour du profil'
            );
        }
    }
};

// Initialisation: vérifier si un token existe au chargement de l'application
const token = localStorage.getItem('token');
if (token) {
    setAuthToken(token);
}

export default authService;