# Utiliser une image Node.js
FROM node:18

# Définir le dossier de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste du projet
COPY . .

# Exposer le port utilisé par l'API
EXPOSE 5000

# Démarrer le serveur
CMD ["npm", "run", "dev"]
