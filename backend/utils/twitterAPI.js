const { TwitterApi } = require('twitter-api-v2');

class TwitterService {
  constructor() {
    this.client = new TwitterApi(process.env.TWITTER_BEARER_TOKEN);
    this.readOnlyClient = this.client.readOnly;
  }

  async searchTweets(query, maxResults = 10) {
    try {
      console.log(`Searching Twitter for: "${query}"`);
      
      // Ensure max_results is between 10 and 100
      const validMaxResults = Math.max(10, Math.min(maxResults, 100));
      
      const tweets = await this.readOnlyClient.v2.search(query, {
        'tweet.fields': ['created_at', 'public_metrics', 'author_id', 'text'],
        'user.fields': ['username', 'name'],
        max_results: validMaxResults,
        expansions: ['author_id']
      });

      console.log(`Twitter API Success: Found ${tweets.data.length} tweets`);

      // Check if we have valid data - handle both success and error cases
    if (!tweets) {
    console.log('No response from Twitter API');
    throw new Error('No API response');
    }

    if (tweets.errors) {
    console.log('Twitter API errors:', tweets.errors);
    throw new Error(`Twitter API error: ${tweets.errors[0]?.message}`);
    }

    if (!tweets.data || !Array.isArray(tweets.data)) {
    console.log('Invalid Twitter API response structure:', JSON.stringify(tweets).substring(0, 200));
    // Return empty array instead of throwing error
    return [];
    }

      const users = tweets.includes?.users || [];
      const userMap = {};
      users.forEach(user => {
        userMap[user.id] = user;
      });

      const processedTweets = tweets.data.map(tweet => {
        const user = userMap[tweet.author_id];
        return {
          tweetId: tweet.id,
          content: tweet.text,
          username: user ? user.username : 'unknown_user',
          date: new Date(tweet.created_at),
          retweetCount: tweet.public_metrics.retweet_count || 0,
          likeCount: tweet.public_metrics.like_count || 0,
          replyCount: tweet.public_metrics.reply_count || 0,
          quoteCount: tweet.public_metrics.quote_count || 0,
          searchTerm: query
        };
      });

      console.log(`Processed ${processedTweets.length} tweets`);
      return processedTweets;

    } catch (error) {
      console.error('Twitter API Error Details:', error);
      
      // More specific error handling
      if (error.code === 401) {
        throw new Error('Invalid Twitter API credentials');
      } else if (error.code === 429) {
        throw new Error('Twitter API rate limit exceeded. Please wait and try again.');
      } else if (error.code === 403) {
        throw new Error('Twitter API access forbidden');
      } else if (error.code === 400) {
        throw new Error(`Twitter API bad request: ${error.errors?.[0]?.message || error.message}`);
      } else {
        throw new Error(`Twitter API failed: ${error.message}`);
      }
    }
  }

  // Enhanced sample data generator (fallback)
  async getSampleTweets(searchTerm, count = 10) {
    console.log(`Using enhanced sample data for: "${searchTerm}"`);
    const sampleTweets = this.generateRealisticTweets(searchTerm, count);
    return sampleTweets;
  }

  generateRealisticTweets(searchTerm, count) {
    const positiveTemplates = [
      `Just built an amazing project with ${searchTerm}! The documentation is fantastic. #coding`,
      `New update for ${searchTerm} is live! Can't wait to try the new features.`,
      `The ${searchTerm} community is so helpful! Great support and resources.`,
      `Found a great tutorial for ${searchTerm} beginners. Highly recommend!`,
      `The performance improvements in the latest ${searchTerm} version are impressive!`,
      `Loving ${searchTerm} for rapid prototyping. So productive!`,
      `${searchTerm} has completely changed how I approach development. Amazing tool!`
    ];

    const negativeTemplates = [
      `Struggling with ${searchTerm} today. The learning curve is steep.`,
      `Why does ${searchTerm} have to be so complicated? Spending hours debugging.`,
      `Dealing with ${searchTerm} dependency issues today. So frustrating.`,
      `The ${searchTerm} documentation could really use some improvement.`,
      `Running into compatibility issues with ${searchTerm} and other libraries.`,
      `${searchTerm} breaking changes are making migration painful.`
    ];

    const neutralTemplates = [
      `Learning ${searchTerm} hooks and context API for state management.`,
      `Working on a new feature using ${searchTerm}. Interesting approach.`,
      `Reading about ${searchTerm} best practices. Some good insights.`,
      `Attending a webinar about ${searchTerm} performance optimization.`,
      `Comparing ${searchTerm} with other frameworks for our next project.`
    ];

    const allTemplates = [...positiveTemplates, ...negativeTemplates, ...neutralTemplates];
    const tweets = [];

    for (let i = 0; i < count; i++) {
      const randomTemplate = allTemplates[Math.floor(Math.random() * allTemplates.length)];
      const tweetId = `sample_${searchTerm}_${i}_${Date.now()}`;
      
      // Determine sentiment based on template content
      let baseEngagement;
      if (positiveTemplates.includes(randomTemplate)) {
        baseEngagement = Math.floor(Math.random() * 100) + 20;
      } else if (negativeTemplates.includes(randomTemplate)) {
        baseEngagement = Math.floor(Math.random() * 50) + 10;
      } else {
        baseEngagement = Math.floor(Math.random() * 30) + 5;
      }

      const isViral = Math.random() > 0.9;
      
      const retweetCount = isViral ? baseEngagement * 5 : Math.floor(baseEngagement * 0.3);
      const likeCount = isViral ? baseEngagement * 10 : baseEngagement;
      
      tweets.push({
        tweetId: tweetId,
        content: randomTemplate,
        username: `dev_user_${Math.floor(Math.random() * 10000)}`,
        date: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
        retweetCount: retweetCount,
        likeCount: likeCount,
        replyCount: Math.floor(Math.random() * 20),
        searchTerm: searchTerm
      });
    }

    return tweets;
  }
}

module.exports = TwitterService;