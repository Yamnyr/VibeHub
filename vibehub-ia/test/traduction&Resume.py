from transformers import pipeline

# Charger le pipeline de résumé
summarizer = pipeline("summarization", model="google/flan-t5-large")


# Texte à résumer
# texte = """
# L'intelligence artificielle (IA) est un domaine de l'informatique qui vise à créer des systèmes capables
# d'effectuer des tâches normalement associées à l'intelligence humaine. Ces tâches incluent la reconnaissance
# visuelle, la compréhension du langage naturel, la prise de décision et l'apprentissage automatique.
# """

texte = """
Artificial intelligence (AI) is a field of computer science that aims to create systems capable of performing 
tasks typically associated with human intelligence. These tasks include visual recognition, natural language 
understanding, decision-making, and machine learning.
"""

# Ajouter une instruction explicite pour forcer le résumé en français
texte_avec_instruction = "If the text is in french, just resume it. If the text is in english, translate to french and resume it : " + texte
ListesMots = texte_avec_instruction.split(" ")

print(ListesMots)
print(len(ListesMots))
# Générer un résumé
resume = summarizer(texte_avec_instruction, max_length=len(ListesMots), min_length=15, do_sample=False)

# Afficher le résumé
print(resume[0]['summary_text'])