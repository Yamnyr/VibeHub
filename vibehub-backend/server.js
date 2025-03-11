const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const commentRoutes = require('./routes/commentRoutes');
const likeRoutes = require('./routes/likeRoutes');
const repostRoutes = require('./routes/repostRoutes');
const followRoutes = require('./routes/followRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const postRoutes = require('./routes/postRoutes');
const connectDB = require("./config/db");

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/', repostRoutes);
app.use('/api/', likeRoutes);
app.use('/api/', commentRoutes);
app.use('/api/', followRoutes);
app.use('/api/', notificationRoutes);
app.use('/api/', postRoutes);
app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API VibaeHub Clone !");
});

connectDB()
// Démarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));