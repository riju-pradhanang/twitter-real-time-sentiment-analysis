class SimpleSentimentAnalyzer {
  constructor() {
    this.initialized = true;
  }

  analyzeSentiment(text) {
    const cleanedText = this.cleanText(text);
    
    // Enhanced rule-based sentiment analysis (fallback)
    const positiveWords = ['love', 'amazing', 'excellent', 'outstanding', 'brilliant', 'fantastic', 'perfect', 'awesome', 'incredible', 'good', 'great', 'best', 'better', 'happy', 'joy', 'positive', 'wonderful'];
    const negativeWords = ['hate', 'terrible', 'awful', 'horrible', 'disgusting', 'worthless', 'useless', 'pathetic', 'bad', 'worst', 'sad', 'angry', 'negative', 'dislike', 'stupid', 'dumb', 'disappointing'];
    
    const tokens = cleanedText.toLowerCase().split(/\s+/);
    let positiveCount = 0;
    let negativeCount = 0;
    
    tokens.forEach(token => {
      if (positiveWords.includes(token)) positiveCount++;
      if (negativeWords.includes(token)) negativeCount++;
    });
    
    const total = positiveCount + negativeCount;
    let polarity = 0;
    
    if (total > 0) {
      polarity = (positiveCount - negativeCount) / total;
    }
    
    let sentiment;
    let confidence;
    
    if (polarity > 0.1) {
      sentiment = 'positive';
      confidence = polarity;
    } else if (polarity < -0.1) {
      sentiment = 'negative';
      confidence = -polarity;
    } else {
      sentiment = 'neutral';
      confidence = 0.5;
    }
    
    return {
      polarity: polarity,
      sentiment: sentiment,
      confidence: Math.max(0.1, confidence),
      model: 'rule-based',
      rawScores: [
        { label: 'negative', score: Math.max(0, -polarity) },
        { label: 'neutral', score: 1 - Math.abs(polarity) },
        { label: 'positive', score: Math.max(0, polarity) }
      ]
    };
  }

  cleanText(text) {
    return text
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }
}

module.exports = SimpleSentimentAnalyzer;