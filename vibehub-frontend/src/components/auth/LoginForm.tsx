import { FormEvent, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword } from '../../utils/validation';
import { Link } from "react-router-dom";

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const { user, login, logout, loading, error } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (emailError || passwordError) {
            setErrors({ email: emailError, password: passwordError });
            return;
        }
        await login(email, password);
    };

    // Si l'utilisateur est déjà connecté
    if (user) {
        return (
            <div className="text-center">
                <p className="text-lg font-medium ">
                    Vous êtes connecté en tant que <span className="font-bold">{user.user.nom}</span>.
                </p>
                <button
                    onClick={logout}
                    className="mt-4 bg-red-600 hover:bg-red-700 focus:outline-none font-medium rounded- text-sm px-5 py-2">
                    Se déconnecter
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">
                    Votre email
                </label>
                <input
                    type="email"
                    id="email"
                    className="text-sm rounded block w-full p-2 bg-[var(--background-main)]"
                    placeholder="nom@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>
            <div>
                <label htmlFor="password" className="block mb-2 text-sm font-medium">
                    Mot de passe
                </label>
                <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="bg-[var(--background-main)] text-sm rounded block w-full p-2"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>
            <button
                type="submit"
                disabled={loading}
                className="w-full bg-[var(--background-main)] font-medium rounded text-sm px-5 py-2 text-center"
            >
                {loading ? 'Connexion...' : 'Se connecter'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <p className="text-sm font-light text-[var(--text-secondary)]">
                Vous n'avez pas encore de compte?{' '}
                <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">
                    S'inscrire
                </Link>
            </p>
        </form>
    );
}
