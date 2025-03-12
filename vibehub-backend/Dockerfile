FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY . .

EXPOSE 5000

# Exécute la commande de seed avant de démarrer l'application
CMD npm run seed && npm start
