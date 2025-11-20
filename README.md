# Twitter Sentiment Analysis Dashboard 🐦🤖

A full-stack MERN application that performs real-time sentiment analysis on Twitter data using Machine Learning. Features a beautiful minimalist black glassmorphism UI.

![Twitter Sentiment Analysis](https://img.shields.io/badge/ML-Powered-blue) 
![MERN Stack](https://img.shields.io/badge/Stack-MERN-green) 
![React](https://img.shields.io/badge/Frontend-React%2FVite-61dafb) 
![Node.js](https://img.shields.io/badge/Backend-Node.js%2FExpress-339933)

## 🚀 Features

- **Real-time Twitter Data** - Ethical web scraping and API integration
- **Machine Learning Sentiment Analysis** - Powered by transformer models
- **Beautiful Glassmorphism UI** - Minimalist black theme with modern design
- **Full MERN Stack** - MongoDB, Express, React, Node.js
- **Real-time Analytics** - Live sentiment statistics and visualization
- **Responsive Design** - Works perfectly on all devices


## 🛠 Tech Stack

### Frontend
- **React 18** - Modern React with hooks
- **Vite** - Fast build tool and dev server
- **Axios** - HTTP client for API calls
- **CSS3** - Custom glassmorphism design

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database with Mongoose ODM
- **Mongoose** - MongoDB object modeling

### Machine Learning & APIs
- **Hugging Face Transformers** - Twitter-RoBERTa sentiment model
- **Twitter API v2** - Official Twitter data access
- **Natural NLP** - Fallback sentiment analysis
- **Sentiment Library** - Rule-based analysis

### Development Tools
- **Nodemon** - Auto-restart for development
- **CORS** - Cross-origin resource sharing
- **Dotenv** - Environment variable management


## 📁 Project Structure

twitter-sentiment-app/
├── backend/
│ ├── models/
│ │ └── Tweet.js # MongoDB tweet schema
│ ├── routes/
│ │ └── tweets.js # REST API endpoints
│ ├── services/
│ │ └── tweetService.js # Business logic layer
│ ├── utils/
│ │ ├── twitterAPI.js # Twitter API integration
│ │ ├── transformersML.js # Hugging Face ML integration
│ │ ├── advancedSentiment.js # ML sentiment analyzer
│ │ ├── simpleSentiment.js # Fallback sentiment analysis
│ │ └── sentimentAnalysis.js # Rule-based sentiment
│ ├── server.js # Express server setup
│ ├── package.json
│ └── .env # Environment variables
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ │ ├── Dashboard.jsx # Main dashboard component
│ │ │ ├── SearchBar.jsx # Search functionality
│ │ │ ├── SentimentStats.jsx # Statistics display
│ │ │ └── TweetList.jsx # Tweet display component
│ │ ├── App.jsx # Root component
│ │ ├── App.css # Glassmorphism styles
│ │ └── index.css # Global styles
│ ├── package.json
│ └── index.html
└── README.md


## ⚙️ Installation & Setup

### **Prerequisites**
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- Twitter Developer Account
- Hugging Face Account (optional)

---

## 🧰 1. Clone the Repository
```bash
git clone https://github.com/yourusername/twitter-sentiment-app.git
cd twitter-sentiment-app



## 🧠 Machine Learning Implementation

### Primary ML Model
- **Model**: `cardiffnlp/twitter-roberta-base-sentiment-latest`
- **Type**: Transformer-based neural network
- **Training**: Pre-trained on Twitter data
- **Accuracy**: State-of-the-art for social media sentiment
- **Features**: 
  - Polarity scoring (-1 to +1)
  - Confidence levels (0-100%)
  - Three-class classification (positive/negative/neutral)

### Fallback Systems
1. **Enhanced Rule-based Analysis** - Custom dictionary with intensity modifiers
2. **Sentiment NPM Package** - VADER-inspired algorithm
3. **Natural Language Processing** - Tokenization and stemming

### ML Architecture
```javascript
// Multi-layer sentiment analysis
1. Hugging Face API Call → Twitter-RoBERTa Model
2. If API fails → Enhanced Rule-based Analysis  
3. Final fallback → Simple Dictionary Approach
