const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' },
    banner: { type: String, default: '' },
    bio: { type: String, default: '' },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // ✅ Ajout des followers
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    createdAt: { type: Date, default: Date.now },
    notificationIsActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('User', UserSchema);
