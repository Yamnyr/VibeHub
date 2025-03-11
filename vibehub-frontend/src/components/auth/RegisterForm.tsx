import {FormEvent, useState} from 'react';
import { useAuth } from '../../context/AuthContext';
import { validateEmail, validatePassword, validateConfirmPassword } from '../../utils/validation';
import {Link} from "react-router-dom";

export default function RegisterForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [nom, setNom] = useState('');
    const [acceptTerms, setAcceptTerms] = useState(false);
    const [errors, setErrors] = useState({ email: '', password: '', confirmPassword: '', terms: '', nom: ''});
    const { register, loading, error } = useAuth();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
        const termsError = !acceptTerms ? "Vous devez accepter les conditions d'utilisation" : '';
        const nomError = nom ? '' : 'Le nom est requis';

        if (emailError || passwordError || confirmPasswordError || termsError || nomError) {
            setErrors({ email: emailError, password: passwordError, confirmPassword: confirmPasswordError, terms: termsError, nom: nomError });
            return;
        }

        await register(email, password, nom);  // Assurez-vous que l'API de register prend en charge ces nouveaux champs
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <div>
                <label htmlFor="nom"
                       className="block mb-2 text-sm font-medium">Nom</label>
                <input
                    type="text"
                    id="nom"
                    className="text-sm rounded block w-full p-2"
                    placeholder="Votre nom"
                    value={nom}
                    onChange={(e) => setNom(e.target.value)}
                />
                {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom}</p>}
            </div>

            <div>
                <label htmlFor="email" className="block mb-2 text-sm font-medium">Votre
                    email</label>
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
                <label htmlFor="password" className="block mb-2 text-sm font-medium">Mot
                    de passe</label>
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

            <div>
                <label htmlFor="confirm-password"
                       className="block mb-2 text-sm font-medium">Confirmer le mot de
                    passe</label>
                <input
                    type="password"
                    id="confirm-password"
                    placeholder="••••••••"
                    className="bg-[var(--background-main)] text-sm rounded block w-full p-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input
                        id="terms"
                        aria-describedby="terms"
                        type="checkbox"
                        className="w-4 h-4 border border-gray-300 rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600"
                        checked={acceptTerms}
                        onChange={(e) => setAcceptTerms(e.target.checked)}
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="font-light text-[var(--text-secondary)]">J'accepte les <a
                        className="font-medium text-primary-600 hover:underline dark:text-primary-500" href="#">Conditions
                        d'utilisation</a></label>
                </div>
            </div>
            {errors.terms && <p className="text-red-500 text-xs mt-1">{errors.terms}</p>}

            <button type="submit" disabled={loading}
                    className="w-full bg-[var(--background-main)] font-medium rounded text-sm px-5 py-2 text-center">
                {loading ? 'Inscription en cours...' : 'Créer un compte'}
            </button>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <p className="text-sm font-light text-[var(--text-secondary)]">
                Vous avez déjà un compte?
                <Link to="/login" className="font-medium text-primary-600 hover:underline">Connectez-vous ici </Link>
            </p>
        </form>
    );
}
