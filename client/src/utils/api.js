// src/utils/api.js
// API client utility for CompounDefi frontend

import axios from 'axios';

// Base API configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';
const API_TIMEOUT = 15000; // 15 seconds

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle token expiration
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      window.dispatchEvent(new Event('auth:logout'));
    }
    return Promise.reject(error);
  }
);

// Portfolio API
const portfolioAPI = {
  getPortfolioAnalysis: (walletAddress) => 
    apiClient.get(`/wallet/${walletAddress}`),
  
  getPortfolioHistory: (walletAddress, period = '30d') => 
    apiClient.get(`/wallet/${walletAddress}/history?period=${period}`),
  
  getYieldPositions: (walletAddress) => 
    apiClient.get(`/wallet/${walletAddress}/yield`),
  
  getApyBreakdown: (walletAddress) => 
    apiClient.get(`/wallet/${walletAddress}/apy`),
  
  getTransactionHistory: (walletAddress, limit = 20, offset = 0) => 
    apiClient.get(`/wallet/${walletAddress}/transactions?limit=${limit}&offset=${offset}`),
  
  getRiskAnalysis: (walletAddress) => 
    apiClient.get(`/wallet/${walletAddress}/risk`)
};

// Recommendation API
const recommendationAPI = {
  getAiRecommendation: (amount, riskProfile, walletAddress = null) => {
    const url = walletAddress 
      ? `/recommendations/ai?amount=${amount}&riskProfile=${riskProfile}&walletAddress=${walletAddress}`
      : `/recommendations/ai?amount=${amount}&riskProfile=${riskProfile}`;
    return apiClient.get(url);
  },
  
  executeStrategy: (walletAddress, amount, allocation, operations) => 
    apiClient.post('/execute-strategy', {
      walletAddress,
      amount,
      allocation,
      operations
    }),
  
  getStrategyComparison: (amount, walletAddress = null) => {
    const url = walletAddress 
      ? `/recommendations/comparison?amount=${amount}&walletAddress=${walletAddress}`
      : `/recommendations/comparison?amount=${amount}`;
    return apiClient.get(url);
  },
  
  getRecommendationHistory: (walletAddress) => 
    apiClient.get(`/recommendations/history/${walletAddress}`)
};

// Auto-Rebalancer API
const rebalancerAPI = {
  getAutoRebalanceStatus: (walletAddress) => 
    apiClient.get(`/auto-rebalance/status?walletAddress=${walletAddress}`),
  
  updateAutoRebalanceSettings: (walletAddress, settings) => 
    apiClient.post('/auto-rebalance/settings', {
      walletAddress,
      ...settings
    }),
  
  executeAutoRebalance: (walletAddress, force = false) => 
    apiClient.post('/auto-rebalance/execute', {
      walletAddress,
      force
    })
};

// Token and Market API
const marketAPI = {
  getTokensLatest: () => apiClient.get('/tokens/latest'),
  
  getNewsLatest: () => apiClient.get('/news/latest'),
  
  getStakingRates: () => apiClient.get('/staking/rates'),
  
  getContracts: () => apiClient.get('/contracts'),
  
  getMarketOverview: () => apiClient.get('/market/overview')
};

// User Authentication API
const authAPI = {
  registerUser: (walletAddress, signature, message) => 
    apiClient.post('/auth/wallet-verify', {
      address: walletAddress,
      signature,
      message
    }),
  
  getNonce: (walletAddress) => 
    apiClient.post('/auth/nonce', { address: walletAddress }),
  
  verifyToken: (token) => 
    apiClient.get('/auth/verify-token', {
      headers: { Authorization: `Bearer ${token}` }
    }),
  
  logout: () => apiClient.post('/auth/logout')
};

// User Profile and Preferences API
const userAPI = {
  getUserProfile: () => apiClient.get('/user/profile'),
  
  updateUserPreferences: (preferences) => 
    apiClient.post('/user/preferences', { preferences }),
  
  getUserActivity: (page = 1, limit = 10) => 
    apiClient.get(`/user/activity?page=${page}&limit=${limit}`),
  
  connectSocial: (platform, code, state) => 
    apiClient.post('/social-connect', { platform, code, state })
};

// Simulation and Transaction API
const transactionAPI = {
  simulateTransaction: (walletAddress, transaction) => 
    apiClient.post(`/wallets/${walletAddress}/simulate-transaction`, { transaction }),
  
  broadcastTransaction: (walletAddress, signedTransaction) => 
    apiClient.post(`/wallets/${walletAddress}/broadcast-transaction`, { signedTransaction }),
  
  checkTransactionStatus: (txHash) => 
    apiClient.get(`/transactions/status/${txHash}`)
};

// Export all API modules
export {
  apiClient,
  portfolioAPI,
  recommendationAPI,
  rebalancerAPI,
  marketAPI,
  authAPI,
  userAPI,
  transactionAPI
};

// Default export for backward compatibility
export default {
  portfolio: portfolioAPI,
  recommendation: recommendationAPI,
  rebalancer: rebalancerAPI,
  market: marketAPI,
  auth: authAPI,
  user: userAPI,
  transaction: transactionAPI
};