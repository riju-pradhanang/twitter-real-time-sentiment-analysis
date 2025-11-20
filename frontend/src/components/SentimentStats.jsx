import React from 'react';

const SentimentStats = ({ stats, searchTerm }) => {
  const { positive, negative, neutral, total, overallSentiment, avgPolarity } = stats;

  const getSentimentColor = (sentiment) => {
    switch(sentiment) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      case 'neutral': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getPercentage = (count) => {
    return total > 0 ? ((count / total) * 100).toFixed(1) : 0;
  };

  return (
    <div className="glass-card sentiment-stats">
      <h2>
        Sentiment Analysis {searchTerm && `for "${searchTerm}"`}
        {!searchTerm && ' - Recent Tweets'}
      </h2>
      
      <div className="stats-overview">
        <div className="overall-sentiment">
          <span className="sentiment-label">Overall Sentiment:</span>
          <span 
            className="sentiment-value"
            style={{ color: getSentimentColor(overallSentiment) }}
          >
            {overallSentiment.toUpperCase()}
          </span>
          <span className="avg-polarity">
            (Avg Polarity: {avgPolarity.toFixed(3)})
          </span>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card positive">
          <h3>Positive</h3>
          <div className="stat-number">{positive}</div>
          <div className="stat-percentage">{getPercentage(positive)}%</div>
        </div>
        
        <div className="stat-card negative">
          <h3>Negative</h3>
          <div className="stat-number">{negative}</div>
          <div className="stat-percentage">{getPercentage(negative)}%</div>
        </div>
        
        <div className="stat-card neutral">
          <h3>Neutral</h3>
          <div className="stat-number">{neutral}</div>
          <div className="stat-percentage">{getPercentage(neutral)}%</div>
        </div>
        
        <div className="stat-card total">
          <h3>Total Tweets</h3>
          <div className="stat-number">{total}</div>
        </div>
      </div>
    </div>
  );
};

export default SentimentStats;