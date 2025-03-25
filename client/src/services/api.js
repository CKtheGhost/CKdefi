// api.js - Service for interacting with CompounDefi API

import axios from 'axios';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000, // 15 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for global error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle API errors
    if (error.response) {
      // Server responded with an error status code
      const status = error.response.status;
      
      // Handle authentication errors
      if (status === 401) {
        localStorage.removeItem('auth_token');
        // Redirect to login page if needed
        if (window.location.pathname !== '/') {
          window.location.href = '/';
        }
      }
      
      // Handle rate limiting
      if (status === 429) {
        console.warn('API rate limit exceeded. Please try again later.');
      }
    } else if (error.request) {
      // Request made but no response received (network error)
      console.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Market Data APIs
export const marketAPI = {
  /**
   * Get latest token data including prices and trends
   * @returns {Promise<Object>} Token data response
   */
  getTokenData: () => {
    return apiClient.get('/tokens/latest');
  },
  
  /**
   * Get latest staking rates from all protocols
   * @returns {Promise<Object>} Staking data response
   */
  getStakingData: () => {
    return apiClient.get('/staking/latest');
  },
  
  /**
   * Get latest news relevant to APT and DeFi
   * @returns {Promise<Object>} News data response
   */
  getLatestNews: () => {
    return apiClient.get('/news/latest');
  },
  
  /**
   * Get contract addresses for all supported protocols
   * @returns {Promise<Object>} Contract addresses
   */
  getContractAddresses: () => {
    return apiClient.get('/contracts');
  }
};

// Wallet and Portfolio APIs
export const walletAPI = {
  /**
   * Get portfolio data for a wallet address
   * @param {string} address - Wallet address
   * @returns {Promise<Object>} Portfolio data
   */
  getPortfolioData: (address) => {
    return apiClient.get(`/wallet/${address}`);
  },
  
  /**
   * Get transaction history for a wallet address
   * @param {string} address - Wallet address
   * @param {number} limit - Maximum number of transactions to return
   * @returns {Promise<Object>} Transaction history
   */
  getTransactionHistory: (address, limit = 20) => {
    return apiClient.get(`/wallet/${address}/transactions`, {
      params: { limit }
    });
  }
};

// AI Recommendation APIs
export const recommendationAPI = {
  /**
   * Generate AI recommendation based on parameters
   * @param {Object} params - Recommendation parameters
   * @param {number} params.amount - Investment amount
   * @param {string} params.riskProfile - Risk profile (conservative, balanced, aggressive)
   * @param {string} params.walletAddress - Optional wallet address for personalized recommendations
   * @returns {Promise<Object>} AI recommendation
   */
  generateRecommendation: (params) => {
    return apiClient.get('/recommendations/ai', { params });
  },
  
  /**
   * Execute a recommended strategy
   * @param {Object} strategy - The strategy to execute
   * @param {string} walletAddress - Wallet address to execute from
   * @returns {Promise<Object>} Execution result
   */
  executeStrategy: (strategy, walletAddress) => {
    return apiClient.post('/execute-strategy', {
      walletAddress,
      strategy
    });
  }
};

// Auto-Optimizer APIs
export const optimizerAPI = {
  /**
   * Get auto-optimizer status
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Object>} Optimizer status
   */
  getStatus: (walletAddress) => {
    return apiClient.get('/auto-rebalance/status', {
      params: { walletAddress }
    });
  },
  
  /**
   * Update auto-optimizer settings
   * @param {string} walletAddress - Wallet address
   * @param {Object} settings - Optimizer settings
   * @returns {Promise<Object>} Updated settings response
   */
  updateSettings: (walletAddress, settings) => {
    return apiClient.post('/auto-rebalance/settings', {
      walletAddress,
      ...settings
    });
  },
  
  /**
   * Execute auto-rebalance
   * @param {string} walletAddress - Wallet address
   * @param {boolean} force - Force execution even if below threshold
   * @returns {Promise<Object>} Execution result
   */
  executeRebalance: (walletAddress, force = false) => {
    return apiClient.post('/auto-rebalance/execute', {
      walletAddress,
      force
    });
  }
};

// User Preferences APIs
export const userAPI = {
  /**
   * Save user preferences
   * @param {Object} preferences - User preferences object
   * @returns {Promise<Object>} Updated preferences
   */
  savePreferences: (preferences) => {
    return apiClient.post('/user/preferences', preferences);
  },
  
  /**
   * Get user profile
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Object>} User profile
   */
  getProfile: (walletAddress) => {
    return apiClient.get(`/user/profile/${walletAddress}`);
  }
};

// Social Media Integration APIs
export const socialAPI = {
  /**
   * Link Twitter account
   * @param {string} walletAddress - Wallet address
   * @param {string} twitterToken - Twitter auth token
   * @returns {Promise<Object>} Connection result
   */
  linkTwitter: (walletAddress, twitterToken) => {
    return apiClient.post('/social/twitter/link', {
      walletAddress,
      twitterToken
    });
  },
  
  /**
   * Link Discord account
   * @param {string} walletAddress - Wallet address
   * @param {string} discordToken - Discord auth token
   * @returns {Promise<Object>} Connection result
   */
  linkDiscord: (walletAddress, discordToken) => {
    return apiClient.post('/social/discord/link', {
      walletAddress,
      discordToken
    });
  },
  
  /**
   * Link Telegram account
   * @param {string} walletAddress - Wallet address
   * @param {string} telegramToken - Telegram auth token
   * @returns {Promise<Object>} Connection result
   */
  linkTelegram: (walletAddress, telegramToken) => {
    return apiClient.post('/social/telegram/link', {
      walletAddress,
      telegramToken
    });
  },
  
  /**
   * Get connected social accounts
   * @param {string} walletAddress - Wallet address
   * @returns {Promise<Object>} Connected accounts
   */
  getConnectedAccounts: (walletAddress) => {
    return apiClient.get(`/social/connected/${walletAddress}`);
  }
};

// Health and status API
export const systemAPI = {
  /**
   * Get application status
   * @returns {Promise<Object>} System status
   */
  getStatus: () => {
    return apiClient.get('/status');
  }
};

// Export combined API service
export default {
  market: marketAPI,
  wallet: walletAPI,
  recommendation: recommendationAPI,
  optimizer: optimizerAPI,
  user: userAPI,
  social: socialAPI,
  system: systemAPI
};