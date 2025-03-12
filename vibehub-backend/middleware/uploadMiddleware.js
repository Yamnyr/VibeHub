const multer = require("multer");
const path = require("path");

// Configuration de stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
            cb(null, "uploads/"); // Dossier de stockage
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Nom unique
    },
});

// Filtrer les fichiers acceptés (images et vidéos)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "video/mp4", "video/webm"];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Type de fichier non supporté"), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
