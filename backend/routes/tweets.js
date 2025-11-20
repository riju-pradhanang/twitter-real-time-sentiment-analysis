const express = require('express');
const router = express.Router();
const Tweet = require('../models/Tweet');
const TwitterService = require('../utils/twitterAPI');
const tweetService = require('../services/tweetService');
const { cleanTweet } = require('../utils/sentimentAnalysis');
const AdvancedSentimentAnalyzer = require('../utils/advancedSentiment');

const mlAnalyzer = new AdvancedSentimentAnalyzer();

// Initialize ML
mlAnalyzer.initialize().then(() => {
  console.log('🎯 ML Sentiment Analysis Ready!');
});

// Get all tweets
router.get('/', async (req, res) => {
  try {
    const { searchTerm, sentiment, limit = 50 } = req.query;
    const tweets = await tweetService.searchTweets(searchTerm || '', sentiment, parseInt(limit));
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get sentiment statistics
router.get('/stats', async (req, res) => {
  try {
    const { searchTerm } = req.query;
    const stats = await tweetService.getSentimentStats(searchTerm);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Scrape new tweets with ML analysis
router.post('/scrape', async (req, res) => {
  try {
    const { searchTerm, count = 10 } = req.body;
    
    if (!searchTerm) {
      return res.status(400).json({ error: 'Search term is required' });
    }

    const twitterService = new TwitterService();
    let tweets;
    let source = 'sample_data';

    try {
      const apiCount = Math.max(10, count);
      tweets = await twitterService.searchTweets(searchTerm, apiCount);
      source = 'twitter_api';
    } catch (apiError) {
      tweets = await twitterService.getSampleTweets(searchTerm, count);
    }
    
    // ML for sentiment analysis
    const processedTweets = [];
    for (let i = 0; i < tweets.length; i++) {
      const tweet = tweets[i];
      const cleanedContent = cleanTweet(tweet.content);
      const sentimentResult = await mlAnalyzer.analyzeSentiment(cleanedContent);
      
      processedTweets.push({
        ...tweet,
        cleanedContent,
        polarity: sentimentResult.polarity,
        sentiment: sentimentResult.sentiment,
        confidence: sentimentResult.confidence,
        mlModel: sentimentResult.model,
        source: source
      });
    }

    const savedTweets = await tweetService.saveTweets(processedTweets);
    
    res.json({
      message: `Analyzed with ${savedTweets[0]?.mlModel || 'ML'} model!`,
      searchTerm,
      newTweets: savedTweets.length,
      mlModel: savedTweets[0]?.mlModel || 'advanced-ml',
      tweets: savedTweets.slice(0, 3)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get recent tweets
router.get('/recent', async (req, res) => {
  try {
    const { limit = 20, searchTerm } = req.query;
    const tweets = await tweetService.getRecentTweets(parseInt(limit), searchTerm);
    res.json(tweets);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ML info endpoint
router.get('/ml-info', (req, res) => {
  res.json({
    mlModel: {
      name: 'Advanced Sentiment Analysis',
      status: 'active',
      features: ['neural network', 'confidence scoring', 'real-time analysis']
    }
  });
});

// Health check
router.get('/health', (req, res) => {
  res.json({ status: 'Tweets routes working with ML!' });
});

// Test scraping
router.get('/test-scrape', async (req, res) => {
  try {
    const { searchTerm = 'technology', count = 3 } = req.query;
    const scraper = new TwitterService();
    const tweets = await scraper.getSampleTweets(searchTerm, parseInt(count));
    res.json({
      message: 'Test successful',
      searchTerm,
      tweets: tweets
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;