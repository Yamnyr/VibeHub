import { useRef, useEffect, useState } from "react";
import Webcam from "react-webcam";

const App = () => {
  const webcamRef = useRef<Webcam>(null);
  const [emotion, setEmotion] = useState("");
  const [emotionYolo, setEmotionYolo] = useState("");
  const captureFrame = async () => {
    if (webcamRef.current) {
      // Capture l'image en base64
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        try {
          const response = await fetch("http://127.0.0.1:5001/predict", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageSrc }),
          });

          const data = await response.json();
          // console.log(data);
          setEmotion(data.emotion);
        } catch (error) {
          console.error("Erreur lors de l'envoi de l'image:", error);
        }
        // try {
        //   const response = await fetch("http://127.0.0.1:5001/predictYolo", {
        //     method: "POST",
        //     headers: { "Content-Type": "application/json" },
        //     body: JSON.stringify({ image: imageSrc }),
        //   });

        //   const data2 = await response.json();
        //   console.log(data2);
        //   setEmotionYolo(data2);
        // } catch (error) {
        //   console.error("Erreur lors de l'envoi de l'image:", error);
        // }
      }
    }
  };

  // Capture une frame toutes les 500 ms
  useEffect(() => {
    const interval = setInterval(captureFrame, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
    <div>
      <h1>Détection d'émotion</h1>
      {/* Webcam cachée */}
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg"  />
      {/* <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ display: "none" }} /> */}

      <p>Émotion détectée : {emotion}</p>
    </div>
    <div>
      <h1>Détection d'émotion Yolo</h1>
      {/* Webcam cachée */}
      <Webcam ref={webcamRef} screenshotFormat="image/jpeg"  />
      {/* <Webcam ref={webcamRef} screenshotFormat="image/jpeg" style={{ display: "none" }} /> */}

      <p>Émotion détectée : {emotionYolo}</p>
    </div>
    </>
  );
};

export default App;
