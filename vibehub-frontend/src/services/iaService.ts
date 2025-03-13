import axios from 'axios';

const API_URL = 'http://localhost:5001';

class AIService {
    /**
     * Traduit un texte vers une langue cible
     * @param content - Texte à traduire
     * @param language - Langue cible
     * @returns Texte traduit
     */
    static async translateText(content: string, language: string): Promise<{ translated_text: string }> {
        try {
            const response = await axios.post(`${API_URL}/translate`, { content, language });
            return response.data;
        } catch (error) {
            console.error("Erreur lors de la traduction:", error);
            throw error;
        }
    }

    // /**
    //  * Résume un texte
    //  * @param content - Texte à résumer
    //  * @returns Résumé du texte
    //  */
    // static async summarizeText(content: string): Promise<string> {
    //     try {
    //         const response = await axios.post(`${API_URL}/resume`, { content });
    //         return response.data;
    //     } catch (error) {
    //         console.error("Erreur lors du résumé du texte:", error);
    //         throw error;
    //     }
    // }
}

export default AIService;