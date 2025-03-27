// env.js - Environment configuration for CompounDefi server
require('dotenv').config();

/**
 * Environment configuration with sensible defaults
 */
module.exports = {
  // Server configuration
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  
  // Aptos network configuration
  APTOS_NETWORK: process.env.APTOS_NETWORK || 'MAINNET',
  
  // AI API keys
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  
  // Database configuration (if needed)
  DATABASE_URL: process.env.DATABASE_URL,
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000), // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || 100), // 100 requests per window
  
  // Cache settings
  CACHE_TTL: {
    stakingData: parseInt(process.env.CACHE_TTL_STAKING || 10 * 60 * 1000), // 10 minutes
    newsData: parseInt(process.env.CACHE_TTL_NEWS || 15 * 60 * 1000),      // 15 minutes
    tokenData: parseInt(process.env.CACHE_TTL_TOKENS || 5 * 60 * 1000),    // 5 minutes
    generalStrategy: parseInt(process.env.CACHE_TTL_STRATEGY || 60 * 60 * 1000) // 1 hour
  },
  
  // Auto-rebalancer settings
  REBALANCER: {
    minRebalanceThreshold: parseFloat(process.env.MIN_REBALANCE_THRESHOLD || 5), // 5% drift
    maxSlippage: parseFloat(process.env.MAX_SLIPPAGE || 2.5), // 2.5% max slippage
    gasBuffer: parseFloat(process.env.GAS_BUFFER || 1.15), // 15% gas buffer
    maxRetries: parseInt(process.env.MAX_RETRIES || 3), // 3 retries max
    operationDelay: parseInt(process.env.OPERATION_DELAY || 500) // 500ms between operations
  },
  
  // External API settings
  COINMARKETCAP_API_KEY: process.env.COINMARKETCAP_API_KEY,
  COINGECKO_API_KEY: process.env.COINGECKO_API_KEY,
  
  // News API settings
  NEWS_API_KEY: process.env.NEWS_API_KEY,
  NEWS_SOURCES: process.env.NEWS_SOURCES || 'crypto-panic,coindesk,cointelegraph',
  
  // Debug settings
  DEBUG: process.env.DEBUG || false,
  LOG_LEVEL: process.env.LOG_LEVEL || 'info'
};