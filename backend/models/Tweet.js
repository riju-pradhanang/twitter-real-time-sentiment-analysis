const mongoose = require('mongoose');

const tweetSchema = new mongoose.Schema({
  tweetId: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String,
    required: true
  },
  cleanedContent: {
    type: String,
    required: true
  },
  username: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  polarity: {
    type: Number,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true
  },
  retweetCount: {
    type: Number,
    default: 0
  },
  likeCount: {
    type: Number,
    default: 0
  },
  searchTerm: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index for better query performance
tweetSchema.index({ searchTerm: 1, date: -1 });
tweetSchema.index({ sentiment: 1 });

module.exports = mongoose.model('Tweet', tweetSchema);