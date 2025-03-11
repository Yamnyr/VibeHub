import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from "lucide-react";

const Register = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        username: ''
    });
    const [formError, setFormError] = useState<string | null>(null);
    const { register, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const { email, password, confirmPassword, username } = formData;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword || !username) {
            setFormError('Veuillez remplir tous les champs obligatoires');
            return;
        }

        if (password !== confirmPassword) {
            setFormError('Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            setFormError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        await register(email, password, username);
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-[var(--text-primary)]">
            <div className="w-full max-w-md bg-[var(--background-secondary)] shadow-lg rounded-2xl p-8 animate-fadeIn">
                <h2 className="text-center text-3xl font-bold">Créer un compte</h2>
                <p className="mt-2 text-center text-sm">
                    Déjà un compte ?{' '}
                    <Link to="/login" className="text-[var(--accent)] hover:text-[var(--accent)] font-medium">
                        Connectez-vous
                    </Link>
                </p>

                {(error || formError) && (
                    <div className="mt-4 text-red-700">
                        <span>{formError || error}</span>
                    </div>
                )}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="username" className="block text-sm font-medium">
                                Nom d'utilisateur
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Nom d'utilisateur"
                                value={username}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Adresse email"
                                value={email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium">
                                Mot de passe
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Mot de passe"
                                value={password}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium">
                                Confirmer le mot de passe
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Confirmer le mot de passe"
                                value={confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center gap-2 py-2 px-4 bg-[var(--accent)] hover:bg-[var(--accent-hover)] rounded-lg font-medium transition-all disabled:bg-indigo-400"
                    >
                        {loading && <Loader2 className="h-5 w-5 animate-spin" />}
                        {loading ? 'Inscription en cours...' : "S'inscrire"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
