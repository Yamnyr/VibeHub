const multer = require("multer");
const path = require("path");

// Configuration de stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // 📂 Dossier où enregistrer les fichiers
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname.replace(/\s+/g, "_")); // 🏷 Nom unique
    },
});

// Filtrer les types de fichiers acceptés
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm", "application/pdf"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non supporté"), false);
    }
};

// ✅ Configurer `multer.fields()` pour accepter plusieurs fichiers
const upload = multer({
    storage,
    fileFilter,
}).fields([
    { name: "profilePicture", maxCount: 1 }, // Avatar
    { name: "banner", maxCount: 1 }, // Bannière
    { name: "extraFiles", maxCount: 3 },
    { name: "media", maxCount: 5 } // Fichiers supplémentaires (max 3)
]);

module.exports = upload;
