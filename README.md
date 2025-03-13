Thought for 3 seconds### VibHub

VibHub is a Twitter-like social media platform with integrated facial expression recognition capabilities. This project was developed as part of a hackathon at IPSSI school.

## Project Overview

VibHub allows users to publish tweets, interact with posts from others, and includes an AI component for Facial Expression Recognition (FER). The application can detect emotions such as joy, sadness, anger, surprise, disgust, fear, and neutral expressions in real-time through a user's webcam.

## Team Members (Group 33)

- Quentin WAROQUET
- Marine RAPIN
- Erwan LAUNAY
- Charles-Henri PAGNEST
- Bruno SA E SILVA
- Florian MULLER


## Features

### Core Functionality

- **Tweet Publication**: Users can post short messages with text, images, and videos
- **Hashtags & Mentions**: Support for hashtags and user mentions
- **Tweet Interactions**: Like, retweet, reply, and bookmark functionality
- **Personalized Feed**: Customized content based on user preferences and interactions
- **Real-time Notifications**: Alerts for likes, retweets, replies, and new followers
- **Advanced Search**: Find tweets, users, or hashtags with various filtering options
- **User Profiles**: Customizable profiles with bio, profile picture, and activity history


### AI Component

- **Facial Expression Recognition**: Real-time emotion detection through webcam
- **Emotion Categories**: Joy, sadness, anger, surprise, disgust, fear, and neutral


## Technologies Used

### Frontend

- React.js
- Tailwind CSS


### Backend

- Node.js
- Express.js
- MongoDB Atlas


### AI Component

- Deep Learning CNN Model
- Flask API


### Deployment

- Docker


## Installation & Setup

### Option 1: Using Docker (Recommended)

1. Clone the repository
2. Navigate to the project root directory
3. Run the following command:

```plaintext
docker-compose up --build
```




### Option 2: Manual Setup

#### Backend Setup

1. Create a `.env` file in the root of the backend directory with the following content:

```plaintext
MONGO_URI=mongodb://localhost:27017/vibehub
PORT=5000
JWT_SECRET=your_secret_key
```


2. Navigate to the backend directory:

```plaintext
cd vibehub-backend
```


3. Install dependencies:

```plaintext
npm install
```


4. Start the backend server:

```plaintext
npm run dev
```




#### Frontend Setup

1. Open a new terminal
2. Navigate to the frontend directory:

```plaintext
cd vibehub-frontend
```


3. Install dependencies:

```plaintext
npm install
```


4. Start the frontend development server:

```plaintext
npm run dev
```




## Project Structure

```plaintext
vibehub/
├── vibehub-frontend/     # React.js frontend
├── vibehub-backend/      # Node.js & Express backend
├── vibehub-ai/           # AI component with Flask API
├── docker-compose.yml    # Docker configuration
└── README.md             # Project documentation
```

## Usage

After starting the application:

1. Access the web interface at `http://localhost:3000`
2. Create an account or log in
3. Start posting tweets and interacting with other users
4. Enable your webcam to use the facial expression recognition feature


## License

This project was created for educational purposes as part of a hackathon at IPSSI school.