const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');  // Importer les routes utilisateur

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
connectDB();

// Routes
app.use('/api/users', userRoutes);  // Préfixer les routes des utilisateurs

app.get("/", (req, res) => {
    res.send("Bienvenue sur l'API Twitter Clone !");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Serveur lancé sur le port ${PORT}`));
