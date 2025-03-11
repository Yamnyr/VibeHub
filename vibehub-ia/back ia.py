from flask import Flask, request, jsonify
from flask_cors import CORS
import torch
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import numpy as np
import cv2
import base64
from io import BytesIO
import os
from detoxify import Detoxify
os.environ["TF_ENABLE_ONEDNN_OPTS"] = "0"

app = Flask(__name__)
CORS(app)  # Autoriser les requêtes depuis le front

# Charger le modèle de reconnaissance d’émotions
MODEL_NAME = "Rajaram1996/FacialEmoRecog"
image_processor = AutoImageProcessor.from_pretrained(MODEL_NAME, use_fast=True)
model = AutoModelForImageClassification.from_pretrained(MODEL_NAME)

# Détecteur de visages OpenCV
face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')

def preprocess_image(image_data):
    """ Convertit l'image base64 en format OpenCV """
    image_bytes = base64.b64decode(image_data.split(",")[1])
    image = Image.open(BytesIO(image_bytes)).convert("RGB")
    return np.array(image)

def detect_emotion(image_array):
    """
    Détecte l’émotion d’un visage à partir d’une image en tableau numpy.

    Args:
        image_array: Image sous forme de tableau numpy (format OpenCV)

    Returns:
        L’émotion détectée avec le score le plus élevé
    """
    gray = cv2.cvtColor(image_array, cv2.COLOR_RGB2GRAY)
    faces = face_cascade.detectMultiScale(gray, 1.1, 4)

    # Si aucun visage n'est détecté, utiliser l'image entière
    if len(faces) == 0:
        face_pil = Image.fromarray(image_array)
    else:
        x, y, w, h = faces[0]  # Prendre le premier visage détecté
        face_img = image_array[y:y+h, x:x+w]
        face_pil = Image.fromarray(face_img)

    # Inférence du modèle
    inputs = image_processor(images=face_pil, return_tensors="pt")
    outputs = model(**inputs)
    predictions = outputs.logits.softmax(dim=1)
    
    # Trouver l’émotion avec le score le plus élevé
    predicted_class_idx = predictions.argmax().item()
    emotion = model.config.id2label[predicted_class_idx]
    confidence = float(predictions[0][predicted_class_idx])

    return {"emotion": emotion, "confiance": confidence}

@app.route("/predict", methods=["POST"])
def predict():
    """ Endpoint pour prédire l’émotion à partir d’une image """
    data = request.get_json()
    if "image" not in data:
        return jsonify({"error": "Aucune image fournie"}), 400

    image_array = preprocess_image(data["image"])
    result = detect_emotion(image_array)

    return jsonify(result)

@app.route("/moderate", methods=["POST"])
def moderate():
    """ Modération d'un post """
    data = request.get_json()
    if "text" not in data:
        return jsonify({"error": "Aucun texte fourni"}), 400

    results = Detoxify('multilingual').predict(data["text"])
    if results["toxicity"] > 0.5 or results["severe_toxicity"] > 0.5 or results["obscene"] > 0.5 or results["identity_attack"] > 0.5 or results["insult"] > 0.5 or results["threat"] > 0.5 or results["sexual_explicit"] > 0.5:
        return jsonify("IsToxic : True")

    return jsonify("IsToxic : False")



if __name__ == "__main__":
    app.run(debug=True,port=5001)
