const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const followRoutes = require('./routes/followRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');
const feedRoutes = require('./routes/feedRoutes');
const searchRoutes = require('./routes/searchRoutes');
const connectDB = require("./config/db");
const { join } = require("path");
const http = require("http");
const { Server } = require('socket.io');

dotenv.config();
const app = express();
const server = http.createServer(app);  // Utilisation de http.createServer()


// Configuration de Socket.IO
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000", // Remplace par l'URL de ton frontend en production
        methods: ["GET", "POST"]
    }
});

const connectedUsers = new Map(); // Associe userId <-> socketId

io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté :", socket.id);

    // 🔹 L'utilisateur envoie son ID après authentification
    socket.on("userConnected", (userId) => {
        connectedUsers.set(userId, socket.id);
        console.log(`Utilisateur ${userId} connecté avec le socket ${socket.id}`);
    });

    //io.to(userId).emit("newComment", { message: "Nouveau commentaire" });

    // 🔹 Gestion de la déconnexion
    socket.on("disconnect", () => {
        for (const [userId, socketId] of connectedUsers.entries()) {
            if (socketId === socket.id) {
                connectedUsers.delete(userId);
                console.log(`Utilisateur ${userId} déconnecté`);
                break;
            }
        }
    });
});

// 🔹 Exporter `io` et `connectedUsers` pour les contrôleurs
module.exports = { io, connectedUsers };

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/', followRoutes);
app.use('/api/', notificationRoutes);
app.use('/api/', postRoutes);
app.use('/api/', feedRoutes);
app.use('/api/', searchRoutes);
app.use("/uploads", express.static(join(__dirname, "uploads")));

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API VibaeHub Clone !");
});

// Connexion à MongoDB AVANT de démarrer le serveur
connectDB().then(() => {
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`🚀 Serveur démarré sur le port ${PORT}`));
}).catch(err => {
    console.error("❌ Erreur lors de la connexion à MongoDB :", err);
});
