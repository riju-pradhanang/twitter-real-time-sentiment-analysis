const Tweet = require('../models/Tweet');

class TweetService {
  async saveTweets(tweetsData) {
    try {
      const savedTweets = [];
      
      for (const tweetData of tweetsData) {
        // Check if tweet already exists to avoid duplicates
        const existingTweet = await Tweet.findOne({ tweetId: tweetData.tweetId });
        
        if (!existingTweet) {
          const tweet = new Tweet(tweetData);
          const savedTweet = await tweet.save();
          savedTweets.push(savedTweet);
        }
      }
      
      console.log(`Saved ${savedTweets.length} new tweets`);
      return savedTweets;
    } catch (error) {
      console.error('Error saving tweets:', error);
      throw error;
    }
  }

  async getRecentTweets(limit = 50, searchTerm = null) {
    try {
      let query = {};
      if (searchTerm) {
        query.searchTerm = new RegExp(searchTerm, 'i');
      }
      
      const tweets = await Tweet.find(query)
        .sort({ date: -1 })
        .limit(limit);
      
      return tweets;
    } catch (error) {
      console.error('Error fetching tweets:', error);
      throw error;
    }
  }

  async getSentimentStats(searchTerm = null) {
    try {
      let matchStage = {};
      if (searchTerm) {
        matchStage.searchTerm = new RegExp(searchTerm, 'i');
      }
      
      const stats = await Tweet.aggregate([
        { $match: matchStage },
        {
          $group: {
            _id: '$sentiment',
            count: { $sum: 1 },
            avgPolarity: { $avg: '$polarity' }
          }
        }
      ]);

      // Format the stats
      const formattedStats = {
        positive: 0,
        negative: 0,
        neutral: 0,
        total: 0,
        overallSentiment: 'neutral',
        avgPolarity: 0
      };

      let totalPolarity = 0;
      let totalTweets = 0;

      stats.forEach(stat => {
        formattedStats[stat._id] = stat.count;
        formattedStats.total += stat.count;
        totalPolarity += stat.avgPolarity * stat.count;
        totalTweets += stat.count;
      });

      formattedStats.avgPolarity = totalTweets > 0 ? totalPolarity / totalTweets : 0;
      
      // Determine overall sentiment
      if (formattedStats.avgPolarity > 0.1) {
        formattedStats.overallSentiment = 'positive';
      } else if (formattedStats.avgPolarity < -0.1) {
        formattedStats.overallSentiment = 'negative';
      } else {
        formattedStats.overallSentiment = 'neutral';
      }

      return formattedStats;
    } catch (error) {
      console.error('Error getting sentiment stats:', error);
      throw error;
    }
  }

  async searchTweets(query, sentiment = null, limit = 50) {
    try {
      let searchQuery = {
        $or: [
          { content: new RegExp(query, 'i') },
          { cleanedContent: new RegExp(query, 'i') },
          { searchTerm: new RegExp(query, 'i') }
        ]
      };

      if (sentiment && sentiment !== 'all') {
        searchQuery.sentiment = sentiment;
      }

      const tweets = await Tweet.find(searchQuery)
        .sort({ date: -1 })
        .limit(limit);

      return tweets;
    } catch (error) {
      console.error('Error searching tweets:', error);
      throw error;
    }
  }
}

module.exports = new TweetService();