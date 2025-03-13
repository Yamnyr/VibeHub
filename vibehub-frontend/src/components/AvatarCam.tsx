import React, { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const AvatarCamPlaceholder = ({ src, size = "w-24 h-24" }: { src?: string; size?: string }) => {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState("");

  const captureFrame = async () => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const response = await fetch("http://127.0.0.1:5001/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageSrc }),
          });

          const data = await response.json();
          setEmotion(data.emotion);
        } catch (error) {
          console.error("Erreur lors de l'envoi de l'image:", error);
        }
      }
    }
  };

  // Capture une frame toutes les 5 secondes
  useEffect(() => {
    const interval = setInterval(captureFrame, 5000);
    return () => clearInterval(interval);
  }, []);

  const getEmotionIcon = (emotion: string) => {
    const emojiMap: { [key: string]: string } = {
      happy: "happy-svgrepo-com.svg",  // Lien fictif, remplace par le bon
      sadness: "sad-svgrepo-com.svg",
      anger: "angry-svgrepo-com.svg",
      neutral: "confused-svgrepo-com.svg",
      surprise: "bored-svgrepo-com.svg",
      fear: "quiet-svgrepo-com.svg",
      disgust: "quiet-svgrepo-com.svg",
    };

    return emojiMap[emotion] ? (
      <img src={emojiMap[emotion]} alt={emotion} className="w-12 h-12 mt-2" />
    ) : (
      <img src="confused-svgrepo-com.svg" alt="neutral" className="w-12 h-12 mt-2" />
    );
  };

  return (
    <>
      <div className="flex flex-col items-center space-y-4">
        <div className={`${size} rounded-full border-4 border-[var(--bg-secondary)] flex items-center justify-center overflow-hidden bg-gray-300`}>
          {src ? (
            <img src={src} alt="Avatar" className="w-24 h-24 object-cover" />
          ) : (
            <Webcam ref={webcamRef} className="transform scale-[1.35]" screenshotFormat="image/jpeg" />
          )}
        </div>
        <div>{emotion}</div>
        <div>{getEmotionIcon(emotion)}</div>
      </div>
    </>
  );
};

export default AvatarCamPlaceholder;
