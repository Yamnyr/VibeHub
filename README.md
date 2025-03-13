### VibHub

VibHub est une plateforme de médias sociaux similaire à Twitter avec des capacités intégrées de reconnaissance d'expressions faciales. Ce projet a été développé dans le cadre d'un hackathon à l'école IPSSI.

## Aperçu du Projet

VibHub permet aux utilisateurs de publier des tweets, d'interagir avec les publications des autres, et inclut une composante IA pour la Reconnaissance d'Expressions Faciales (FER). L'application peut détecter des émotions telles que la joie, la tristesse, la colère, la surprise, le dégoût, la peur et les expressions neutres en temps réel via la webcam d'un utilisateur.

## Membres de l'Équipe (Groupe 33)

- Quentin WAROQUET
- Marine RAPIN
- Erwan LAUNAY
- Charles-Henri PAGNEST
- Bruno SA E SILVA
- Florian MULLER


## Fonctionnalités

### Fonctionnalités Principales

- **Publication de Tweets**: Les utilisateurs peuvent poster des messages courts avec du texte, des images et des vidéos
- **Hashtags & Mentions**: Support pour les hashtags et les mentions d'utilisateurs
- **Interactions avec les Tweets**: Fonctionnalités de like, retweet, réponse et marque-page
- **Fil d'Actualité Personnalisé**: Contenu personnalisé basé sur les préférences et interactions de l'utilisateur
- **Notifications en Temps Réel**: Alertes pour les likes, retweets, réponses et nouveaux abonnés
- **Recherche Avancée**: Trouvez des tweets, utilisateurs ou hashtags avec diverses options de filtrage
- **Profils Utilisateurs**: Profils personnalisables avec bio, photo de profil et historique d'activité


### Composante IA

- **Reconnaissance d'Expressions Faciales**: Détection d'émotions en temps réel via webcam
- **Catégories d'Émotions**: Joie, tristesse, colère, surprise, dégoût, peur et neutre


## Technologies Utilisées

### Frontend

- React.js
- Tailwind CSS


### Backend

- Node.js
- Express.js
- MongoDB Compass


### Composante IA

- Modèle CNN de Deep Learning
- API Flask


### Déploiement

- Docker


## Installation & Configuration

### Option 1: Utilisation de Docker (Recommandée)

1. Clonez le dépôt
2. Naviguez vers le répertoire racine du projet

1. Créez un fichier `.env` à la racine du répertoire backend avec le contenu suivant:

```plaintext
MONGO_URI=mongodb://localhost:27017/vibehub
PORT=5000
JWT_SECRET=your_secret_key
```
3. Exécutez la commande suivante:

```plaintext
docker-compose up --build
```




### Option 2: Configuration Manuelle

#### Configuration du Backend

1. Créez un fichier `.env` à la racine du répertoire backend avec le contenu suivant:

```plaintext
MONGO_URI=mongodb://localhost:27017/vibehub
PORT=5000
JWT_SECRET=your_secret_key
```


2. Naviguez vers le répertoire backend:

```plaintext
cd vibehub-backend
```


3. Installez les dépendances:

```plaintext
npm install
```


4. Démarrez le serveur backend:

```plaintext
npm run dev
```




#### Configuration du Frontend

1. Ouvrez un nouveau terminal
2. Naviguez vers le répertoire frontend:

```plaintext
cd vibehub-frontend
```


3. Installez les dépendances:

```plaintext
npm install
```


4. Démarrez le serveur de développement frontend:

```plaintext
npm run dev
```




## Structure du Projet

```plaintext
vibehub/
├── vibehub-frontend/     # Frontend React.js
├── vibehub-backend/      # Backend Node.js & Express
├── vibehub-ai/           # Composante IA avec API Flask
├── docker-compose.yml    # Configuration Docker
└── README.md             # Documentation du projet
```

## Utilisation

Après avoir démarré l'application:

1. Accédez à l'interface web à `http://localhost:3000`
2. Créez un compte ou connectez-vous
3. Commencez à publier des tweets et à interagir avec d'autres utilisateurs
4. Activez votre webcam pour utiliser la fonctionnalité de reconnaissance d'expressions faciales


## Licence

Ce projet a été créé à des fins éducatives dans le cadre d'un hackathon à l'école IPSSI.