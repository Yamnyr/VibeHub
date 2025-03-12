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

connectDB()
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));