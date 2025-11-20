const natural = require('natural');
const { WordTokenizer, PorterStemmer } = natural;
const tokenizer = new WordTokenizer();

// Simple sentiment analysis function
function analyzeSentiment(text) {
  if (!text || text.trim().length === 0) {
    return { polarity: 0, sentiment: 'neutral' };
  }

  // Clean the text
  const cleanedText = text.toLowerCase().replace(/[^\w\s]/g, '');
  const tokens = tokenizer.tokenize(cleanedText);
  
  if (!tokens || tokens.length === 0) {
    return { polarity: 0, sentiment: 'neutral' };
  }

  // Simple sentiment dictionary (expandable)
  const positiveWords = new Set(['good', 'great', 'excellent', 'amazing', 'awesome', 'fantastic', 'love', 'like', 'nice', 'best', 'better', 'happy', 'joy', 'positive', 'wonderful', 'perfect', 'outstanding', 'brilliant', 'superb', 'fantastic']);
  const negativeWords = new Set(['bad', 'terrible', 'awful', 'hate', 'worst', 'horrible', 'sad', 'angry', 'negative', 'dislike', 'stupid', 'dumb', 'disappointing', 'poor', 'rubbish', 'garbage', 'trash', 'useless', 'awful', 'horrendous']);
  
  let positiveCount = 0;
  let negativeCount = 0;
  
  tokens.forEach(token => {
    const stemmed = PorterStemmer.stem(token);
    if (positiveWords.has(stemmed)) {
      positiveCount++;
    } else if (negativeWords.has(stemmed)) {
      negativeCount++;
    }
  });
  
  const total = positiveCount + negativeCount;
  if (total === 0) {
    return { polarity: 0, sentiment: 'neutral' };
  }
  
  const polarity = (positiveCount - negativeCount) / total;
  
  let sentiment;
  if (polarity > 0.1) {
    sentiment = 'positive';
  } else if (polarity < -0.1) {
    sentiment = 'negative';
  } else {
    sentiment = 'neutral';
  }
  
  return { polarity, sentiment };
}

function cleanTweet(text) {
  if (!text) return '';
  
  // Remove URLs, mentions, and extra spaces
  return text
    .replace(/https?:\/\/\S+/g, '') // Remove URLs
    .replace(/@\w+/g, '') // Remove mentions
    .replace(/#/g, '') // Remove hashtag symbols but keep text
    .replace(/\s+/g, ' ') // Replace multiple spaces with single space
    .trim();
}

module.exports = {
  analyzeSentiment,
  cleanTweet
};