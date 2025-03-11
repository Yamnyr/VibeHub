import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";

const Login = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [formError, setFormError] = useState<string | null>(null);
    const { login, loading, error, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { email, password } = formData;

    useEffect(() => {
        if (isAuthenticated) {
            const from = (location.state as any)?.from?.pathname || "/";
            navigate(from, { replace: true });
        }
    }, [isAuthenticated, navigate, location]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setFormError(null);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email || !password) {
            setFormError("Veuillez remplir tous les champs");
            return;
        }
        await login(email, password);
    };

    return (
        <div className="min-h-screen flex items-center justify-center text-[var(--text-primary)]">
            <div className="w-full max-w-md bg-[var(--background-secondary)] shadow-lg rounded-2xl p-8 animate-fadeIn">
                <h2 className="text-center text-3xl font-bold ">Connexion</h2>
                <p className="mt-2 text-center text-sm">
                    Pas encore de compte ?{" "}
                    <Link to="/register" className="text-[var(--accent)] hover:text-[var(--accent)] font-medium">
                        Inscrivez-vous
                    </Link>
                </p>

                {(error || formError) && (
                    <div className="mt-4  text-red-700">
                        <span>{formError || error}</span>
                    </div>
                )}

                <form className="mt-6 space-y-5" onSubmit={handleSubmit}>
                    <div className="space-y-3">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium ">
                                Adresse email
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Votre email"
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
                                autoComplete="current-password"
                                required
                                className="mt-1 w-full px-4 py-2 border border-transparent rounded-lg shadow-sm focus:ring-[var(--accent)] focus:border-[var(--accent)]"
                                placeholder="Votre mot de passe"
                                value={password}
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
                        {loading ? "Connexion en cours..." : "Se connecter"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
