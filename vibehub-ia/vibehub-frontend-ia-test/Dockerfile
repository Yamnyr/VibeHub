# Utiliser une image Node.js officielle
FROM node:18 AS builder

# Définir le dossier de travail
WORKDIR /app

# Copier package.json et package-lock.json pour installer les dépendances en premier
COPY package.json package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier tout le projet dans l'image
COPY . .

# Construire l’application React
RUN npm run build

# Utiliser une image plus légère pour exécuter le serveur
FROM node:18-alpine AS runner

WORKDIR /app

# Installer `serve` pour servir l'application React
RUN npm install -g serve

# Copier les fichiers construits depuis l'étape précédente
COPY --from=builder /app/dist /app/dist

# Exposer le port 3000
EXPOSE 3000

# Démarrer le serveur
CMD ["serve", "-s", "dist", "-l", "3000"]
