// database.js - Database configuration (optional)
const env = require('./env');

/**
 * Database configuration for CompounDefi
 * This is optional - the app can function without a database using in-memory caching
 */
module.exports = {
  // Database connection settings
  connection: {
    url: env.DATABASE_URL,
    enabled: !!env.DATABASE_URL,
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 5000,
      serverSelectionTimeoutMS: 5000
    }
  },
  
  // In-memory caching configuration
  cache: {
    enabled: true,
    ttl: {
      stakingData: env.CACHE_TTL.stakingData,
      newsData: env.CACHE_TTL.newsData,
      tokenData: env.CACHE_TTL.tokenData,
      generalStrategy: env.CACHE_TTL.generalStrategy,
      portfolioData: 5 * 60 * 1000, // 5 minutes
      aiRecommendations: 60 * 60 * 1000, // 1 hour
      rebalanceHistory: 24 * 60 * 60 * 1000 // 24 hours
    },
    maxItems: {
      portfolioData: 100,
      aiRecommendations: 50,
      rebalanceHistory: 20
    }
  },
  
  // Collection/table names
  collections: {
    users: 'users',
    portfolios: 'portfolios',
    recommendations: 'recommendations',
    rebalanceHistory: 'rebalance_history',
    userPreferences: 'user_preferences',
    marketData: 'market_data',
    tokenData: 'token_data',
    newsData: 'news_data'
  },
  
  // Methods to initialize database connection
  connect: async function() {
    if (!this.connection.enabled) {
      console.log('Database connection disabled, using in-memory storage');
      return null;
    }
    
    try {
      if (!this.connection.url) {
        throw new Error('DATABASE_URL not provided');
      }
      
      // This is a placeholder for actual database connection code
      // In a real implementation, you would use a specific database driver
      // For example, with MongoDB:
      /*
      const mongoose = require('mongoose');
      await mongoose.connect(this.connection.url, this.connection.options);
      console.log('Connected to database');
      return mongoose.connection;
      */
      
      console.log('Database connection initialized');
      return { status: 'connected' }; // Placeholder
    } catch (error) {
      console.error('Database connection failed:', error.message);
      console.log('Falling back to in-memory storage');
      return null;
    }
  },
  
  // Simple in-memory data store (fallback when no database is configured)
  memoryStore: {
    data: {},
    
    get(collection, key) {
      if (!this.data[collection]) return null;
      const item = this.data[collection][key];
      if (!item) return null;
      
      // Check if item has expired
      if (item.expiry && item.expiry < Date.now()) {
        delete this.data[collection][key];
        return null;
      }
      
      return item.value;
    },
    
    set(collection, key, value, ttl) {
      if (!this.data[collection]) {
        this.data[collection] = {};
      }
      
      // Set expiry time if TTL is provided
      const expiry = ttl ? Date.now() + ttl : null;
      
      this.data[collection][key] = {
        value,
        expiry,
        timestamp: Date.now()
      };
      
      // Enforce max items limit
      const maxItems = module.exports.cache.maxItems[collection];
      if (maxItems && Object.keys(this.data[collection]).length > maxItems) {
        this.pruneCollection(collection);
      }
      
      return value;
    },
    
    delete(collection, key) {
      if (!this.data[collection]) return false;
      if (this.data[collection][key]) {
        delete this.data[collection][key];
        return true;
      }
      return false;
    },
    
    pruneCollection(collection) {
      if (!this.data[collection]) return;
      
      // Get all items with their timestamps
      const items = Object.entries(this.data[collection])
        .map(([key, item]) => ({ key, timestamp: item.timestamp }))
        .sort((a, b) => a.timestamp - b.timestamp);
      
      // Keep only the newest items up to max limit
      const maxItems = module.exports.cache.maxItems[collection] || 100;
      const itemsToRemove = items.slice(0, items.length - maxItems);
      
      itemsToRemove.forEach(item => {
        delete this.data[collection][item.key];
      });
    },
    
    clear(collection) {
      if (collection) {
        this.data[collection] = {};
      } else {
        this.data = {};
      }
    }
  }
};