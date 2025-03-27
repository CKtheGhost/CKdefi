// modules/news_tracker.js - Crypto news aggregation and analysis for CompounDefi
const axios = require('axios');
const { Anthropic } = require('@anthropic-ai/sdk');

// Initialize AI client for news analysis
let anthropicClient;
if (process.env.ANTHROPIC_API_KEY) {
  anthropicClient = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY
  });
}

/**
 * News Tracker Module - Fetches and analyzes crypto news with a focus on Aptos ecosystem
 */
const newsTracker = {
  /**
   * Get latest news from multiple sources
   * @returns {Promise<Object>} News articles and metadata
   */
  getLatestNews: async function() {
    try {
      // Combine results from multiple sources
      const [cryptoPanicNews, twitterNews] = await Promise.allSettled([
        this.getCryptoPanicNews(),
        this.getTwitterNews()
      ]);

      // Extract articles from successful responses
      const articles = [
        ...(cryptoPanicNews.status === 'fulfilled' ? cryptoPanicNews.value : []),
        ...(twitterNews.status === 'fulfilled' ? twitterNews.value : [])
      ];

      // Sort by date (newest first) and limit to 25 articles
      const sortedArticles = articles
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 25);

      // Add sentiment analysis if possible
      const analyzedArticles = await this.analyzeNewsContent(sortedArticles);
      
      // Organize articles by category
      const categories = this.categorizeArticles(analyzedArticles);
      
      // Find featured article (highest relevance score)
      const featuredArticle = analyzedArticles.length > 0 ? 
        analyzedArticles.reduce((prev, current) => 
          (current.relevanceScore > prev.relevanceScore) ? current : prev
        ) : null;

      return {
        articles: analyzedArticles,
        categories,
        featuredArticle,
        marketInfo: {
          sentiment: this.determineMarketSentiment(analyzedArticles),
          trendingTopics: this.extractTrendingTopics(analyzedArticles)
        },
        lastUpdated: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error in getLatestNews:', error);
      // Return default structure even on error
      return {
        articles: [],
        categories: {},
        featuredArticle: null,
        marketInfo: { sentiment: "Neutral", trendingTopics: [] },
        lastUpdated: new Date().toISOString(),
        error: error.message
      };
    }
  },

  /**
   * Get news from CryptoPanic API
   * @returns {Promise<Array>} News articles
   */
  getCryptoPanicNews: async function() {
    try {
      const apiKey = process.env.CRYPTOPANIC_API_KEY || '';
      const url = `https://cryptopanic.com/api/v1/posts/?auth_token=${apiKey}&currencies=aptos&kind=news`;
      
      const response = await axios.get(url);
      
      if (!response.data || !response.data.results) {
        throw new Error('Invalid response from CryptoPanic API');
      }
      
      // Transform data to standard format
      return response.data.results.map(item => ({
        headline: item.title,
        summary: item.metadata?.description || '',
        source: item.source?.title || 'CryptoPanic',
        date: new Date(item.created_at).toISOString(),
        url: item.url,
        image: item.metadata?.image || null,
        category: this.detectCategory(item.title, item.metadata?.description || ''),
        readTime: this.estimateReadTime(item.metadata?.description || '')
      }));
    } catch (error) {
      console.error('Error fetching CryptoPanic news:', error);
      return [];
    }
  },

  /**
   * Get news from Twitter (now X) about Aptos
   * @returns {Promise<Array>} News articles from Twitter
   */
  getTwitterNews: async function() {
    try {
      // This would normally use Twitter API, but as an example we'll create some mock data
      // Replace with actual Twitter API implementation for production
      
      // Mock data for development
      return [
        {
          headline: "Aptos Labs partners with major retailer for payment solutions",
          summary: "New partnership announced between Aptos Labs and a major retail chain to develop blockchain-based payment solutions.",
          source: "Twitter",
          date: new Date().toISOString(),
          url: "https://twitter.com/AptosLabs/status/1234567890",
          image: null,
          category: "Business",
          readTime: 2
        },
        {
          headline: "New protocol launches on Aptos with $10M TVL within hours",
          summary: "A new DeFi protocol has launched on Aptos blockchain and already secured $10M in Total Value Locked. Users report yields up to 18% APR.",
          source: "Twitter",
          date: new Date(Date.now() - 3600000).toISOString(),
          url: "https://twitter.com/AptosEcosystem/status/1234567891",
          image: null,
          category: "DeFi",
          readTime: 3
        }
      ];
    } catch (error) {
      console.error('Error fetching Twitter news:', error);
      return [];
    }
  },

  /**
   * Analyze news content for sentiment and relevance using AI
   * @param {Array} articles - News articles to analyze
   * @returns {Promise<Array>} Articles with analysis added
   */
  analyzeNewsContent: async function(articles) {
    try {
      if (!anthropicClient || articles.length === 0) {
        // If no AI client or no articles, return original articles with default scores
        return articles.map(article => ({
          ...article,
          sentiment: 'Neutral',
          relevanceScore: 5,
          impactScore: 5
        }));
      }

      // Select up to 10 articles for analysis to control API usage
      const articlesToAnalyze = articles.slice(0, 10);
      
      const prompt = `
        As a financial news analyst specializing in cryptocurrency and DeFi, analyze the following news articles about Aptos blockchain.
        For each article, provide:
        1. Sentiment (Positive/Neutral/Negative)
        2. Relevance score for Aptos DeFi investors (1-10)
        3. Potential market impact score (1-10)
        
        Articles to analyze:
        ${articlesToAnalyze.map((article, index) => `
          ARTICLE ${index + 1}:
          Headline: ${article.headline}
          Summary: ${article.summary}
          Source: ${article.source}
          Date: ${article.date}
        `).join('\n')}
        
        Provide output in JSON format:
        {
          "analyses": [
            {
              "index": 0,
              "sentiment": "Positive",
              "relevanceScore": 8,
              "impactScore": 7,
              "summary": "Brief analysis"
            },
            ...
          ]
        }
      `;

      const response = await anthropicClient.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 4000,
        temperature: 0.2,
        messages: [
          { role: "user", content: prompt }
        ]
      });

      const content = response.content[0].text;
      let analysisResults;
      
      try {
        // Extract JSON from response
        const jsonMatch = content.match(/```json\n([\s\S]*?)\n```/) || content.match(/{[\s\S]*?}/);
        if (jsonMatch) {
          analysisResults = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } else {
          throw new Error('Could not parse AI response as JSON');
        }
      } catch (parseError) {
        console.error('Error parsing AI response:', parseError);
        return articles.map(article => ({
          ...article,
          sentiment: 'Neutral',
          relevanceScore: 5,
          impactScore: 5
        }));
      }

      // Merge analysis with original articles
      return articles.map((article, index) => {
        if (index < articlesToAnalyze.length && analysisResults.analyses[index]) {
          const analysis = analysisResults.analyses[index];
          return {
            ...article,
            sentiment: analysis.sentiment,
            relevanceScore: analysis.relevanceScore,
            impactScore: analysis.impactScore,
            aiSummary: analysis.summary || ''
          };
        } else {
          // For articles not analyzed, provide default values
          return {
            ...article,
            sentiment: 'Neutral',
            relevanceScore: 5,
            impactScore: 5
          };
        }
      });
    } catch (error) {
      console.error('Error in news analysis:', error);
      return articles.map(article => ({
        ...article,
        sentiment: 'Neutral',
        relevanceScore: 5,
        impactScore: 5
      }));
    }
  },

  /**
   * Categorize articles based on content analysis
   * @param {Array} articles - News articles
   * @returns {Object} Categories with count
   */
  categorizeArticles: function(articles) {
    const categories = {
      'DeFi': 0,
      'Staking': 0,
      'Market': 0,
      'Development': 0,
      'Business': 0,
      'Aptos': 0,
      'General': 0
    };

    articles.forEach(article => {
      const category = article.category || 'General';
      if (categories[category] !== undefined) {
        categories[category]++;
      } else {
        categories['General']++;
      }
    });

    // Filter out empty categories
    return Object.fromEntries(Object.entries(categories).filter(([_, count]) => count > 0));
  },

  /**
   * Detect article category based on content
   * @param {string} title - Article title
   * @param {string} description - Article description
   * @returns {string} Category
   */
  detectCategory: function(title, description) {
    const content = (title + ' ' + description).toLowerCase();
    
    if (content.includes('stake') || content.includes('staking') || content.includes('validator')) {
      return 'Staking';
    } else if (content.includes('defi') || content.includes('yield') || content.includes('liquidity') || 
              content.includes('swap') || content.includes('lend') || content.includes('borrow')) {
      return 'DeFi';
    } else if (content.includes('price') || content.includes('market') || content.includes('bull') || 
              content.includes('bear') || content.includes('trend')) {
      return 'Market';
    } else if (content.includes('develop') || content.includes('update') || content.includes('release') || 
              content.includes('version') || content.includes('protocol')) {
      return 'Development';
    } else if (content.includes('partner') || content.includes('launch') || content.includes('announce') || 
              content.includes('company')) {
      return 'Business';
    } else if (content.includes('aptos')) {
      return 'Aptos';
    } else {
      return 'General';
    }
  },

  /**
   * Determine overall market sentiment based on news analysis
   * @param {Array} articles - Analyzed news articles
   * @returns {string} Market sentiment (Bullish/Bearish/Neutral)
   */
  determineMarketSentiment: function(articles) {
    if (articles.length === 0) return 'Neutral';

    // Count sentiment distribution
    const sentimentCounts = {
      'Positive': 0,
      'Neutral': 0,
      'Negative': 0
    };

    // Consider only the last 15 articles and weigh by impact score
    const recentArticles = articles.slice(0, 15);
    
    recentArticles.forEach(article => {
      const sentiment = article.sentiment || 'Neutral';
      const impact = article.impactScore || 5;
      
      // Higher impact articles have more weight in sentiment calculation
      sentimentCounts[sentiment] += impact / 5;
    });

    // Determine overall sentiment
    if (sentimentCounts['Positive'] > sentimentCounts['Negative'] * 1.5) {
      return 'Bullish';
    } else if (sentimentCounts['Negative'] > sentimentCounts['Positive'] * 1.2) {
      return 'Bearish';
    } else {
      return 'Neutral';
    }
  },

  /**
   * Extract trending topics from news articles
   * @param {Array} articles - News articles
   * @returns {Array} Trending topics
   */
  extractTrendingTopics: function(articles) {
    if (articles.length === 0) return [];

    // Simple algorithm to extract keywords and count occurrences
    const keywordCounts = {};
    const keywords = [
      'staking', 'yield', 'apy', 'liquidity', 'amm', 'dao', 'governance',
      'token', 'launch', 'update', 'partnership', 'security', 'hack',
      'airdrop', 'bridge', 'swap', 'lending', 'borrowing'
    ];

    articles.forEach(article => {
      const content = `${article.headline} ${article.summary}`.toLowerCase();
      
      keywords.forEach(keyword => {
        if (content.includes(keyword)) {
          keywordCounts[keyword] = (keywordCounts[keyword] || 0) + 1;
        }
      });
    });

    // Sort by frequency and return top 5
    return Object.entries(keywordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([topic]) => topic);
  },

  /**
   * Estimate reading time for an article
   * @param {string} text - Article text
   * @returns {number} Estimated reading time in minutes
   */
  estimateReadTime: function(text) {
    const wordsPerMinute = 200;
    const wordCount = text.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / wordsPerMinute);
    return Math.max(1, Math.min(readingTime, 10)); // Between 1-10 minutes
  }
};

module.exports = newsTracker;