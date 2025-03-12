from transformers import pipeline

# Charger le pipeline de résumé
classifier = pipeline("text-classification", model="google/flan-t5-large")

texte = """
Artificial intelligence (AI) is a field of computer science that aims to create systems capable of performing 
tasks typically associated with human intelligence. These tasks include visual recognition, natural language 
understanding, decision-making, and machine learning.
"""

result=classifier(texte)
print(result)