import { useState } from "react";
import PostService from "../services/postService";

interface CreatePostProps {
    onPostCreated: () => void;
    parentId?: string; // Optionnel pour les commentaires
}

const CreatePost = ({ onPostCreated, parentId }: CreatePostProps) => {
    const [content, setContent] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [files, setFiles] = useState<FileList | null>(null);
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setFiles(e.target.files);
        }
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim() && !files) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const formData = new FormData();
            formData.append("content", content);
            if (parentId) formData.append("parentId", parentId);
            if (files) {
                Array.from(files).forEach(file => formData.append("media", file));
            }

            await PostService.createPost(formData);
            setContent("");
            setFiles(null);
            onPostCreated();
        } catch (error: any) {
            console.error("Erreur lors de la création du post:", error);
            setError(error.response?.data?.message || "Impossible de publier votre message. Veuillez réessayer.");
        } finally {
            setIsSubmitting(false);
        }
    };
    const placeholderText = parentId
        ? "Écrivez votre commentaire..."
        : "Quoi de neuf ?";

    const buttonText = parentId
        ? (isSubmitting ? "Envoi en cours..." : "Commenter")
        : (isSubmitting ? "Publication en cours..." : "Poster");

    return (
        <div className="bg-[var(--bg-secondary)] p-4 rounded-lg border border-gray-700 mb-4">
            <form onSubmit={handleSubmit}>
        <textarea
            className="w-full p-3 bg-transparent text-[var(--text-primary)] border border-gray-600 rounded-lg focus:outline-none focus:border-[var(--accent)]"
            placeholder={placeholderText}
            rows={parentId ? 2 : 3}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
        />
                <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleFileChange}
                    className="mt-2 text-white"
                />

                {error && (
                    <div className="mt-2 text-red-500 text-sm">{error}</div>
                )}

                <button
                    type="submit"
                    className={`mt-3 w-full font-bold py-2 rounded-lg transition-colors ${
                        isSubmitting
                            ? "bg-gray-500 cursor-not-allowed"
                            : "bg-[var(--accent)] hover:bg-[var(--accent-hover)] text-white"
                    }`}
                    disabled={isSubmitting}
                >
                    {buttonText}
                </button>
            </form>
        </div>
    );
};

export default CreatePost;