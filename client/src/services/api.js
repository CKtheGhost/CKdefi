// api.js - Core API service for CompounDefi frontend
// Handles all API communication with the backend server

import axios from 'axios';
import storageService from './storageService';

// Base API URL - should be moved to environment variable in production
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 seconds timeout
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    const token = storageService.getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle token expiration
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt to refresh token
        const refreshToken = storageService.getRefreshToken();
        if (refreshToken) {
          const res = await apiClient.post('/auth/refresh-token', { refreshToken });
          if (res.data.token) {
            storageService.setToken(res.data.token);
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${res.data.token}`;
            return apiClient(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        // Logout user on failed refresh
        storageService.clearSession();
        window.location.href = '/';
      }
    }
    
    return Promise.reject(error);
  }
);

// Market Data APIs
const marketAPI = {
  // Get market overview
  getMarketOverview: async () => {
    try {
      const response = await apiClient.get('/tokens/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      throw error;
    }
  },
  
  // Get latest news
  getLatestNews: async () => {
    try {
      const response = await apiClient.get('/news/latest');
      return response.data;
    } catch (error) {
      console.error('Error fetching latest news:', error);
      throw error;
    }
  },
  
  // Get staking rates across protocols
  getStakingRates: async () => {
    try {
      const response = await apiClient.get('/staking/rates');
      return response.data;
    } catch (error) {
      console.error('Error fetching staking rates:', error);
      throw error;
    }
  },
  
  // Get protocol contract addresses
  getContractAddresses: async () => {
    try {
      const response = await apiClient.get('/contracts');
      return response.data;
    } catch (error) {
      console.error('Error fetching contract addresses:', error);
      throw error;
    }
  }
};

// Portfolio and Wallet APIs
const portfolioAPI = {
  // Get wallet portfolio analysis
  getPortfolioAnalysis: async (walletAddress) => {
    try {
      const response = await apiClient.get(`/wallet/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching portfolio for ${walletAddress}:`, error);
      throw error;
    }
  },
  
  // Get wallet transaction history
  getTransactionHistory: async (walletAddress, limit = 20, offset = 0) => {
    try {
      const response = await apiClient.get(
        `/wallets/${walletAddress}/transactions?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching transaction history for ${walletAddress}:`, error);
      throw error;
    }
  },
  
  // Get staking positions
  getStakingPositions: async (walletAddress) => {
    try {
      const response = await apiClient.get(`/wallets/${walletAddress}/staking`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching staking positions for ${walletAddress}:`, error);
      throw error;
    }
  },
  
  // Get historical portfolio performance
  getHistoricalPerformance: async (walletAddress, timeframe = '30d') => {
    try {
      const response = await apiClient.get(
        `/wallet/${walletAddress}/history?period=${timeframe}`
      );
      return response.data;
    } catch (error) {
      console.error(`Error fetching portfolio history for ${walletAddress}:`, error);
      throw error;
    }
  },
  
  // Get portfolio risk analysis
  getRiskAnalysis: async (walletAddress) => {
    try {
      const response = await apiClient.get(`/wallet/${walletAddress}/risk`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching risk analysis for ${walletAddress}:`, error);
      throw error;
    }
  }
};

// AI Recommendation APIs
const recommendationAPI = {
  // Get AI investment recommendation
  getRecommendation: async (amount, riskProfile, walletAddress = null) => {
    try {
      let url = `/recommendations/ai?amount=${amount}&riskProfile=${riskProfile}`;
      if (walletAddress) {
        url += `&walletAddress=${walletAddress}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting AI recommendation:', error);
      throw error;
    }
  },
  
  // Execute recommended strategy
  executeStrategy: async (walletAddress, amount, allocation, operations) => {
    try {
      const response = await apiClient.post('/execute-strategy', {
        walletAddress,
        amount,
        allocation,
        operations
      });
      return response.data;
    } catch (error) {
      console.error('Error executing strategy:', error);
      throw error;
    }
  },
  
  // Get recommendation history
  getRecommendationHistory: async (walletAddress) => {
    try {
      const response = await apiClient.get(`/recommendations/history/${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching recommendation history:', error);
      throw error;
    }
  },
  
  // Compare strategy options
  getStrategyComparison: async (amount, walletAddress = null) => {
    try {
      let url = `/recommendations/compare?amount=${amount}`;
      if (walletAddress) {
        url += `&walletAddress=${walletAddress}`;
      }
      
      const response = await apiClient.get(url);
      return response.data;
    } catch (error) {
      console.error('Error getting strategy comparison:', error);
      throw error;
    }
  }
};

// Auto-rebalancer APIs
const rebalancerAPI = {
  // Get auto-rebalance status
  getRebalanceStatus: async (walletAddress) => {
    try {
      const response = await apiClient.get(`/auto-rebalance/status?walletAddress=${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error getting rebalance status:', error);
      throw error;
    }
  },
  
  // Update auto-rebalance settings
  updateRebalanceSettings: async (walletAddress, settings) => {
    try {
      const response = await apiClient.post('/auto-rebalance/settings', {
        walletAddress,
        ...settings
      });
      return response.data;
    } catch (error) {
      console.error('Error updating rebalance settings:', error);
      throw error;
    }
  },
  
  // Execute auto-rebalance
  executeRebalance: async (walletAddress, force = false) => {
    try {
      const response = await apiClient.post('/auto-rebalance/execute', {
        walletAddress,
        force
      });
      return response.data;
    } catch (error) {
      console.error('Error executing rebalance:', error);
      throw error;
    }
  }
};

// User management APIs
const userAPI = {
  // Register/login user with wallet
  registerWithWallet: async (walletAddress, signature, message) => {
    try {
      const response = await apiClient.post('/auth/wallet-verify', {
        address: walletAddress,
        signature,
        message
      });
      
      if (response.data.token) {
        storageService.setToken(response.data.token);
      }
      
      return response.data;
    } catch (error) {
      console.error('Error registering with wallet:', error);
      throw error;
    }
  },
  
  // Get wallet nonce for signing
  getWalletNonce: async (walletAddress) => {
    try {
      const response = await apiClient.post('/auth/nonce', {
        address: walletAddress
      });
      return response.data;
    } catch (error) {
      console.error('Error getting wallet nonce:', error);
      throw error;
    }
  },
  
  // Update user preferences
  updateUserPreferences: async (preferences) => {
    try {
      const response = await apiClient.post('/user/preferences', { preferences });
      return response.data;
    } catch (error) {
      console.error('Error updating user preferences:', error);
      throw error;
    }
  },
  
  // Get user profile
  getUserProfile: async () => {
    try {
      const response = await apiClient.get('/user/profile');
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  }
};

// Combine all API services
const apiService = {
  market: marketAPI,
  portfolio: portfolioAPI,
  recommendation: recommendationAPI,
  rebalancer: rebalancerAPI,
  user: userAPI,
  
  // Exposed the axios instance for custom calls
  client: apiClient
};

export default apiService;