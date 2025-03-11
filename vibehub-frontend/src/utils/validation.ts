export const validateEmail = (email: string): string => {
    if (!email) return "L'email est requis";
    if (!/\S+@\S+\.\S+/.test(email)) return "L'email n'est pas valide";
    return '';
};

export const validatePassword = (password: string): string => {
    if (!password) return "Le mot de passe est requis";
    // if (password.length < 8) return "Le mot de passe doit contenir au moins 8 caractères";
    return '';
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (password !== confirmPassword) return "Les mots de passe ne correspondent pas";
    return '';
};