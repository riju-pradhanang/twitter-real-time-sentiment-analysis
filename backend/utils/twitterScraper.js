const axios = require('axios');
const cheerio = require('cheerio');
const { analyzeSentiment, cleanTweet } = require('./sentimentAnalysis');

// Ethical scraping configuration
const SCRAPING_CONFIG = {
  delayBetweenRequests: 2000, // 2 seconds between requests
  maxRequestsPerMinute: 15,   // Stay within reasonable limits
  userAgent: 'TwitterSentimentAnalysisBot/1.0 (+http://localhost:3000)'
};

class EthicalTwitterScraper {
  constructor() {
    this.requestCount = 0;
    this.lastRequestTime = 0;
  }

  async delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async respectRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < SCRAPING_CONFIG.delayBetweenRequests) {
      await this.delay(SCRAPING_CONFIG.delayBetweenRequests - timeSinceLastRequest);
    }
    
    this.lastRequestTime = Date.now();
    this.requestCount++;
  }

  // Method to simulate Twitter data (for development)
  async getSampleTweets(searchTerm, count = 10) {
    await this.respectRateLimit();

    const sampleTweets = this.generateSampleTweets(searchTerm, count);
    
    // Process each tweet with sentiment analysis
    const processedTweets = sampleTweets.map(tweet => {
      const cleanedContent = cleanTweet(tweet.content);
      const { polarity, sentiment } = analyzeSentiment(cleanedContent);
      
      return {
        ...tweet,
        cleanedContent,
        polarity,
        sentiment,
        searchTerm
      };
    });

    return processedTweets;
  }

  generateSampleTweets(searchTerm, count) {
    const positiveTweets = [
      `I love ${searchTerm}! It's absolutely amazing and wonderful.`,
      `${searchTerm} is the best thing that ever happened to technology.`,
      `Just discovered ${searchTerm} and it's fantastic! Highly recommend.`,
      `Amazing progress in ${searchTerm} field recently. So exciting!`,
      `The future of ${searchTerm} looks bright and promising.`
    ];

    const negativeTweets = [
      `I hate ${searchTerm}. It's terrible and disappointing.`,
      `${searchTerm} is the worst implementation I've ever seen.`,
      `Why does ${searchTerm} have to be so complicated and frustrating?`,
      `Disappointed with the recent changes in ${searchTerm}.`,
      `${searchTerm} is causing so many problems lately.`
    ];

    const neutralTweets = [
      `Reading about ${searchTerm} in the news today.`,
      `Someone mentioned ${searchTerm} in the meeting.`,
      `There's a new article about ${searchTerm}.`,
      `Considering using ${searchTerm} for my project.`,
      `The discussion about ${searchTerm} continues.`
    ];

    const allTweets = [...positiveTweets, ...negativeTweets, ...neutralTweets];
    const tweets = [];

    for (let i = 0; i < count; i++) {
      const randomTweet = allTweets[Math.floor(Math.random() * allTweets.length)];
      const tweetId = `sample_${searchTerm}_${i}_${Date.now()}`;
      const isPositive = randomTweet.includes('love') || randomTweet.includes('amazing') || randomTweet.includes('best') || randomTweet.includes('fantastic');
      const isNegative = randomTweet.includes('hate') || randomTweet.includes('worst') || randomTweet.includes('terrible') || randomTweet.includes('disappointing');

      let retweetCount, likeCount;
      if (isPositive) {
        retweetCount = Math.floor(Math.random() * 50) + 20;
        likeCount = Math.floor(Math.random() * 100) + 50;
      } else if (isNegative) {
        retweetCount = Math.floor(Math.random() * 30) + 10;
        likeCount = Math.floor(Math.random() * 50) + 20;
      } else {
        retweetCount = Math.floor(Math.random() * 20) + 5;
        likeCount = Math.floor(Math.random() * 30) + 10;
      }

      tweets.push({
        tweetId: tweetId,
        content: randomTweet,
        username: `user_${Math.floor(Math.random() * 1000)}`,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Random date in last 7 days
        retweetCount: retweetCount,
        likeCount: likeCount,
        replyCount: Math.floor(Math.random() * 10)
      });
    }

    return tweets;
  }

  // Method to get real public data (ethical approach)
  async getPublicTwitterData(searchTerm) {
    await this.respectRateLimit();

    try {
      // This is just a template for educational purposes
      console.log(`Ethical scraping for: ${searchTerm}`);
      
      // Return sample data for development
      return await this.getSampleTweets(searchTerm, 15);
    } catch (error) {
      console.error('Scraping error:', error);
      throw new Error('Failed to fetch Twitter data');
    }
  }

  // Utility method to check if we're within rate limits
  checkRateLimit() {
    const now = Date.now();
    const oneMinuteAgo = now - 60000;
    
    // Reset counter if it's been more than a minute
    if (this.lastRequestTime < oneMinuteAgo) {
      this.requestCount = 0;
    }
    
    return this.requestCount < SCRAPING_CONFIG.maxRequestsPerMinute;
  }
}

module.exports = EthicalTwitterScraper;