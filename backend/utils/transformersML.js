const axios = require('axios');
const SimpleSentimentAnalyzer = require('./simpleSentiment');


class TransformersSentimentAnalyzer {
  constructor() {
    this.apiUrl = 'https://api-inference.huggingface.co/models/cardiffnlp/twitter-roberta-base-sentiment-latest';
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.isModelLoaded = false;
    this.fallbackAnalyzer = new SimpleSentimentAnalyzer();
    this.loadModel();
  }

  async loadModel() {
    try {
      // Warm up the model
      const response = await axios.post(
        this.apiUrl,
        { inputs: "I love this!" },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );
      this.isModelLoaded = true;
      console.log('🤖 Transformer ML Model loaded successfully!');
    } catch (error) {
      console.log('⚠️  Model loading note:', error.message);
      this.isModelLoaded = true; // Still mark as loaded to try real requests
    }
  }

  async analyzeSentiment(text) {
    // Clean and prepare text
    const cleanText = this.cleanText(text);
    
    if (cleanText.length < 2) {
      return this.getNeutralResult();
    }

    try {
      console.log(`🔍 ML Analysis: "${cleanText.substring(0, 50)}..."`);
      
      const response = await axios.post(
        this.apiUrl,
        { inputs: cleanText },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return this.processTransformerResponse(response.data, cleanText);
    } catch (error) {
      console.error('🤖 ML Model Error:', error.message);
      return this.fallbackAnalysis(cleanText);
    }
  }

  processTransformerResponse(data, text) {
    // Handle different response formats from Hugging Face
    if (Array.isArray(data) && data[0]) {
      const scores = data[0];
      
      // Twitter-RoBERTa returns: [negative, neutral, positive]
      const negativeScore = scores.find(s => s.label === 'negative' || s.label === 'LABEL_0');
      const neutralScore = scores.find(s => s.label === 'neutral' || s.label === 'LABEL_1');
      const positiveScore = scores.find(s => s.label === 'positive' || s.label === 'LABEL_2');

      const scoresArray = [
        { label: 'negative', score: negativeScore?.score || 0 },
        { label: 'neutral', score: neutralScore?.score || 0 },
        { label: 'positive', score: positiveScore?.score || 0 }
      ];

      // Find highest confidence sentiment
      const maxScore = Math.max(...scoresArray.map(s => s.score));
      const bestMatch = scoresArray.find(s => s.score === maxScore);
      
      return {
        polarity: this.calculatePolarity(bestMatch.label, bestMatch.score),
        sentiment: bestMatch.label,
        confidence: bestMatch.score,
        model: 'twitter-roberta-base',
        rawScores: scoresArray,
        text: text
      };
    }
    
    // If response format is unexpected, use fallback
    console.log('Unexpected ML response format:', JSON.stringify(data).substring(0, 200));
    return this.fallbackAnalysis(text);
  }

  calculatePolarity(label, score) {
    const baseScores = {
      'negative': -1,
      'neutral': 0,
      'positive': 1
    };
    
    return baseScores[label] * score;
  }

  fallbackAnalysis(text) {
    // Use our reliable fallback analyzer
    return this.fallbackAnalyzer.analyzeSentiment(text);
  }

  getNeutralResult() {
    return {
      polarity: 0,
      sentiment: 'neutral',
      confidence: 0.1,
      model: 'neutral-fallback',
      rawScores: [
        { label: 'negative', score: 0 },
        { label: 'neutral', score: 1 },
        { label: 'positive', score: 0 }
      ]
    };
  }

  cleanText(text) {
    return text
      .replace(/[^\w\s@#]/g, ' ') // Keep mentions and hashtags
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 280); // Twitter length limit
  }

  async analyzeBatch(texts) {
    const results = [];
    for (const text of texts) {
      // Process sequentially to avoid rate limits
      const result = await this.analyzeSentiment(text);
      results.push(result);
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    return results;
  }
}

module.exports = TransformersSentimentAnalyzer;