import axios from 'axios';
import { createContext, useState, useEffect, ReactNode, useContext } from 'react';

const API_URL = 'http://localhost:5000/api/users';

// Types des données
interface User {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string;
    bio?: string;
    followersCount: number;
    followingCount: number;
}

interface AuthResponse {
    token: string;
    user: User;
}

interface UserData {
    username: string;
    email: string;
    password: string;
}

interface ProfileData {
    username?: string;
    bio?: string;
    profilePicture?: string;
    banner?: string;
}

const setAuthToken = (token: string | null): void => {
    if (token) {
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    }
};

export const authService = {
    register: async (email: string, password: string, username: string): Promise<AuthResponse> => {
        try {
            const userData: UserData = { email, password, username };
            const response = await axios.post<AuthResponse>(`${API_URL}/register`, userData);
            setAuthToken(response.data.token);
            return response.data;
        } catch (error: any) {
            console.log(error.response?.data); // 🔍 Vérifiez ce qui est retourné
            throw new Error(error.response?.data?.error || 'Erreur lors de l\'inscription');
        }
    },

    login: async (email: string, password: string): Promise<AuthResponse> => {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, { email, password });
        setAuthToken(response.data.token);
        return response.data;
    },

    logout: (): void => {
        setAuthToken(null);
        localStorage.removeItem('user');
    },

    isAuthenticated: (): boolean => localStorage.getItem('token') !== null,

    getCurrentUser: (): AuthResponse | null => {
        const user = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        return user && token ? { user: JSON.parse(user), token } : null;
    },

    fetchUserProfile: async (): Promise<User> => {
        const response = await axios.get<User>(`${API_URL}/me`);
        return response.data;
    },

    updateProfile: async (profileData: ProfileData): Promise<User> => {
        const response = await axios.put<{ user: User }>(`${API_URL}/profile`, profileData);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        return response.data.user;
    }
};

const token = localStorage.getItem('token');
if (token) setAuthToken(token);

interface AuthContextProps {
    user: User | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, username: string) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(authService.getCurrentUser()?.user || null);
    const [token, setToken] = useState<string | null>(authService.getCurrentUser()?.token || null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (user && token) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user');
        }
    }, [user, token]);

    const login = async (email: string, password: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.login(email, password);
            setUser(data.user);
            setToken(data.token);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const register = async (email: string, password: string, username: string) => {
        setLoading(true);
        setError(null);
        try {
            const data = await authService.register(email, password, username);
            setUser(data.user);
            setToken(data.token);
        } catch (err: any) {
            setError(err.message || 'Une erreur est survenue');
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
    };

    const isAuthenticated = !!token;

    return (
        <AuthContext.Provider value={{ user, token, login, register, logout, isAuthenticated, loading, error }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};