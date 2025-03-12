const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');;
const followRoutes = require('./routes/followRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');
const feedRoutes = require('./routes/feedRoutes');
const connectDB = require("./config/db");
const {join} = require("path");
const http = require("http");
const { Server } = require('socket.io');


dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/', followRoutes);
app.use('/api/', notificationRoutes);
app.use('/api/', postRoutes);
app.use('/api/', feedRoutes);
app.use("/uploads", express.static(join(__dirname, "uploads")));
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API VibaeHub Clone !");
});

const server = http.createServer(app); 
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Un utilisateur est connecté :", socket.id);

    socket.on("sendMessage", (message) => {
        console.log("Message reçu :", message);

        io.emit("receiveMessage", message);
    });

    socket.on("disconnect", () => {
        console.log("Un utilisateur s'est déconnecté :", socket.id);
    });
});

connectDB()
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));