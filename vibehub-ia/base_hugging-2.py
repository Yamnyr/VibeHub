# Installation des bibliothèques nécessaires
# pip install torch transformers pillow numpy opencv-python

import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import numpy as np
import cv2, os

os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"
def detect_emotion(image_path):
    """
    Détecte les émotions dans un visage à partir d'une image
    
    Args:
        image_path: Chemin vers l'image à analyser
        
    Returns:
        L'émotion détectée et les scores de confiance pour les 7 émotions
    """
    # Charger le modèle de détection d'émotions (7 émotions)
    # Ce modèle est spécifiquement entraîné pour la reconnaissance d'émotions faciales
    model_name = "Rajaram1996/FacialEmoRecog"
    
    # Charger le modèle et le processeur d'images
    image_processor = AutoImageProcessor.from_pretrained(model_name, use_fast=True)
    model = AutoModelForImageClassification.from_pretrained(model_name)
    
    # Détection de visage avec OpenCV
    face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
    img = cv2.imread(image_path)
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)
    
    results = []
    
    # S'il n'y a pas de visage détecté, analyser l'image entière
    if len(faces) == 0:
        image = Image.open(image_path)
        inputs = image_processor(images=image, return_tensors="pt")
        outputs = model(**inputs)
        predictions = outputs.logits.softmax(dim=1)
        predicted_class_idx = predictions.argmax().item()
        emotion = model.config.id2label[predicted_class_idx]
        scores = predictions[0].tolist()
        results.append({
            "emotion": emotion,
            "scores": {model.config.id2label[i]: scores[i] for i in range(len(scores))}
        })
    else:
        # Pour chaque visage détecté
        for (x, y, w, h) in faces:
            # Extraire le visage
            face_img = img[y:y+h, x:x+w]
            face_img = cv2.cvtColor(face_img, cv2.COLOR_BGR2RGB)
            face_pil = Image.fromarray(face_img)
            
            # Préparation et inférence
            inputs = image_processor(images=face_pil, return_tensors="pt")
            outputs = model(**inputs)
            predictions = outputs.logits.softmax(dim=1)
            
            # Obtenir l'émotion prédite
            predicted_class_idx = predictions.argmax().item()
            emotion = model.config.id2label[predicted_class_idx]
            scores = predictions[0].tolist()
            
            results.append({
                "position": (x, y, w, h),
                "emotion": emotion,
                "scores": {model.config.id2label[i]: scores[i] for i in range(len(scores))}
            })
            
            # Dessiner un rectangle autour du visage
            cv2.rectangle(img, (x, y), (x+w, y+h), (255, 0, 0), 2)
            # Ajouter l'émotion comme texte
            cv2.putText(img, emotion, (x, y-10), cv2.FONT_HERSHEY_SIMPLEX, 0.9, (36, 255, 12), 2)
            
        # Sauvegarder l'image avec les annotations
        cv2.imwrite('result/emotion_detected.jpg', img)
    
    return results

# Exemple d'utilisation
if __name__ == "__main__":
    image_path = "./image/photo.jpg"
    results = detect_emotion(image_path)
    
    print("Résultats de la détection d'émotions:")
    for i, result in enumerate(results):
        print(f"Visage {i+1}:")
        print(f"  Émotion détectée: {result['emotion']}")
        print("  Scores de confiance:")
        # Afficher les scores des 7 émotions principales
        top_emotions = sorted(result['scores'].items(), key=lambda x: x[1], reverse=True)
        for emotion, score in top_emotions:
            print(f"    {emotion}: {score:.4f}")