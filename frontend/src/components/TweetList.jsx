import React from 'react';

const TweetList = ({ tweets, loading, searchTerm }) => {
  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'border-l-green-500 bg-green-50';
      case 'negative': return 'border-l-red-500 bg-red-50';
      case 'neutral': return 'border-l-gray-500 bg-gray-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getSentimentTextColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return 'text-green-700';
      case 'negative': return 'text-red-700';
      case 'neutral': return 'text-gray-700';
      default: return 'text-gray-700';
    }
  };

  if (loading) {
    return (
      <div className="glass-card">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Analyzing tweets with AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card tweet-list">
      <h2>
        {searchTerm ? `Tweets about "${searchTerm}"` : 'Recent Tweets'}
        <span className="tweet-count">({tweets.length} tweets)</span>
      </h2>
      
      {tweets.length === 0 ? (
        <div className="empty-state">
          <p>No tweets found.</p>
          <p>Try searching for a term or scraping new tweets!</p>
          <div className="suggestions">
            <p>Try: <strong>javascript</strong>, <strong>react</strong>, <strong>ai</strong>, <strong>machine learning</strong></p>
          </div>
        </div>
      ) : (
        <div className="tweets-container">
          {tweets.map((tweet) => (
            <div 
              key={tweet._id || tweet.tweetId}
              className={`tweet-item ${tweet.sentiment}`}
            >
              <div className="tweet-header">
                <div className="tweet-user">
                  <span className="username">@{tweet.username}</span>
                  <span className="tweet-date">
                    {new Date(tweet.date).toLocaleDateString()} at {new Date(tweet.date).toLocaleTimeString()}
                  </span>
                </div>
                <div className="sentiment-info">
                  <span className={`sentiment-badge ${tweet.sentiment}`}>
                    {tweet.sentiment.toUpperCase()}
                  </span>
                  <span className="confidence">
                    {(tweet.confidence * 100).toFixed(0)}% confident
                  </span>
                </div>
              </div>
              
              <p className="tweet-content">{tweet.content}</p>
              
              <div className="tweet-metrics">
                <span>Polarity: {tweet.polarity?.toFixed(3) || '0.000'}</span>
                <span>❤️ {tweet.likeCount || 0}</span>
                <span>🔄 {tweet.retweetCount || 0}</span>
                <span>ML: {tweet.mlModel || 'analyzed'}</span>
                {tweet.source && <span className="data-source">Source: {tweet.source}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TweetList;