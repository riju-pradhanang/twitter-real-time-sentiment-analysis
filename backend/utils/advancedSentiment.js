const TransformersSentimentAnalyzer = require('./transformersML');

class AdvancedSentimentAnalyzer {
  constructor() {
    this.transformerModel = new TransformersSentimentAnalyzer();
    this.useTransformer = true;
  }

  async initialize() {
    console.log('🚀 Advanced ML Sentiment Analyzer Initialized');
    return true;
  }

  async analyzeSentiment(text) {
    try {
      if (this.useTransformer && process.env.HUGGINGFACE_API_KEY) {
        const result = await this.transformerModel.analyzeSentiment(text);
        console.log(`🤖 ML Result: ${text.substring(0, 30)}... → ${result.sentiment} (${result.confidence.toFixed(2)})`);
        return result;
      } else {
        const result = this.transformerModel.fallbackAnalysis(text);
        console.log(`📊 Fallback: ${text.substring(0, 30)}... → ${result.sentiment}`);
        return result;
      }
    } catch (error) {
      console.error('Advanced sentiment analysis failed:', error);
      return this.transformerModel.fallbackAnalysis(text);
    }
  }

  async testModel() {
    const testTexts = [
      "I love this product! It's amazing!",
      "This is the worst experience ever.",
      "The weather is okay today.",
      "JavaScript is fantastic for web development!",
      "I hate waiting in long lines."
    ];

    console.log('\n🧪 Testing ML Model:');
    const results = [];
    
    for (const text of testTexts) {
      const result = await this.analyzeSentiment(text);
      results.push({
        text: text,
        sentiment: result.sentiment,
        confidence: result.confidence,
        model: result.model
      });
      console.log(`   "${text}" → ${result.sentiment} (${result.model})`);
    }

    return results;
  }
}

module.exports = AdvancedSentimentAnalyzer;