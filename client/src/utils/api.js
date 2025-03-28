// src/services/api.js - Enhanced with error handling and caching
import axios from 'axios';
import { CACHE_DURATIONS, API_ENDPOINTS } from '../utils/constants';

// Create API instance with defaults
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || '/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Simple cache implementation with TTL
const cache = new Map();

// Add request interceptor for auth and timestamps
api.interceptors.request.use(config => {
  // Add timestamp to prevent caching
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  
  // Add auth token if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, error => Promise.reject(error));

// Add response interceptor for error handling
api.interceptors.response.use(
  response => response,
  error => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('auth_token');
      window.dispatchEvent(new CustomEvent('auth:expired'));
    }
    
    // Create standardized error object
    const enhancedError = {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data,
      originalError: error
    };
    
    console.error('API Error:', enhancedError);
    return Promise.reject(enhancedError);
  }
);

/**
 * Make a cached API request
 * @param {string} url - API endpoint
 * @param {Object} options - Request options
 * @param {number} cacheDuration - Cache duration in ms
 * @returns {Promise<Object>} API response
 */
const cachedRequest = async (url, options = {}, cacheDuration = 0) => {
  // Skip cache for non-GET requests or if cache is disabled
  if (cacheDuration <= 0 || (options.method && options.method !== 'get')) {
    return api(url, options);
  }
  
  // Create cache key from URL and params
  const params = options.params ? JSON.stringify(options.params) : '';
  const cacheKey = `${url}:${params}`;
  
  // Check if we have valid cached data
  const cachedData = cache.get(cacheKey);
  if (cachedData && (Date.now() - cachedData.timestamp < cacheDuration)) {
    return Promise.resolve(cachedData.data);
  }
  
  // Make the actual request
  try {
    const response = await api(url, options);
    
    // Cache the response
    cache.set(cacheKey, {
      data: response,
      timestamp: Date.now()
    });
    
    return response;
  } catch (error) {
    // Remove stale cache if exists
    if (cache.has(cacheKey)) {
      cache.delete(cacheKey);
    }
    throw error;
  }
};

/**
 * Clear all cached requests or specific endpoint
 * @param {string} url - Optional URL to clear specific cache
 */
export const clearCache = (url = null) => {
  if (url) {
    // Clear specific URL pattern
    const keysToDelete = [];
    cache.forEach((_, key) => {
      if (key.startsWith(url)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => cache.delete(key));
  } else {
    // Clear all cache
    cache.clear();
  }
};

/**
 * Get market data
 * @returns {Promise<Object>} Market data
 */
export const getMarketData = async () => {
  try {
    const response = await cachedRequest(
      API_ENDPOINTS.MARKET_DATA,
      { method: 'get' },
      CACHE_DURATIONS.MARKET_DATA
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market data:', error);
    throw error;
  }
};

/**
 * Get wallet portfolio data
 * @param {string} address - Wallet address
 * @returns {Promise<Object>} Portfolio data
 */
export const getPortfolio = async (address) => {
  try {
    if (!address) {
      throw new Error('Wallet address is required');
    }
    
    const endpoint = API_ENDPOINTS.PORTFOLIO.replace('{address}', address);
    const response = await cachedRequest(
      endpoint,
      { method: 'get' },
      CACHE_DURATIONS.PORTFOLIO
    );
    
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch portfolio for ${address}:`, error);
    throw error;
  }
};

/**
 * Get AI investment recommendations
 * @param {Object} params - Recommendation parameters
 * @returns {Promise<Object>} AI recommendations
 */
export const getAIRecommendations = async (params) => {
  try {
    const { amount, riskProfile, walletAddress } = params;
    
    if (!amount || !riskProfile) {
      throw new Error('Amount and risk profile are required');
    }
    
    const response = await api.get(API_ENDPOINTS.AI_RECOMMENDATION, {
      params: {
        amount,
        riskProfile,
        walletAddress
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to get AI recommendations:', error);
    throw error;
  }
};

/**
 * Get latest staking data and APRs
 * @returns {Promise<Object>} Staking data
 */
export const getStakingData = async () => {
  try {
    const response = await cachedRequest(
      API_ENDPOINTS.STAKING_DATA,
      { method: 'get' },
      CACHE_DURATIONS.STAKING_DATA
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch staking data:', error);
    throw error;
  }
};

/**
 * Get latest crypto news
 * @returns {Promise<Object>} News data
 */
export const getLatestNews = async () => {
  try {
    const response = await cachedRequest(
      API_ENDPOINTS.NEWS,
      { method: 'get' },
      CACHE_DURATIONS.NEWS
    );
    return response.data;
  } catch (error) {
    console.error('Failed to fetch news:', error);
    throw error;
  }
};

/**
 * Execute a DeFi transaction
 * @param {Object} txData - Transaction data
 * @returns {Promise<Object>} Transaction result
 */
export const executeTransaction = async (txData) => {
  try {
    const response = await api.post('/api/execute', txData);
    return response.data;
  } catch (error) {
    console.error('Transaction execution failed:', error);
    throw error;
  }
};

/**
 * Execute a complete investment strategy
 * @param {string} walletAddress - Wallet address
 * @param {Array} operations - List of operations to execute
 * @returns {Promise<Object>} Strategy execution result
 */
export const executeStrategy = async (walletAddress, operations) => {
  try {
    const response = await api.post('/api/execute-strategy', {
      walletAddress,
      operations
    });
    return response.data;
  } catch (error) {
    console.error('Strategy execution failed:', error);
    throw error;
  }
};

/**
 * Get auto-rebalance status
 * @param {string} walletAddress - Wallet address
 * @returns {Promise<Object>} Rebalance status
 */
export const getRebalanceStatus = async (walletAddress) => {
  try {
    const response = await api.get('/api/auto-rebalance/status', {
      params: { walletAddress }
    });
    return response.data;
  } catch (error) {
    console.error('Failed to get rebalance status:', error);
    throw error;
  }
};

/**
 * Update auto-rebalance settings
 * @param {string} walletAddress - Wallet address
 * @param {Object} settings - Rebalance settings
 * @returns {Promise<Object>} Updated settings
 */
export const updateRebalanceSettings = async (walletAddress, settings) => {
  try {
    const response = await api.post('/api/auto-rebalance/settings', {
      walletAddress,
      ...settings
    });
    return response.data;
  } catch (error) {
    console.error('Failed to update rebalance settings:', error);
    throw error;
  }
};

/**
 * Check API server status
 * @returns {Promise<Object>} API status
 */
export const checkApiStatus = async () => {
  try {
    const response = await api.get(API_ENDPOINTS.STATUS);
    return response.data;
  } catch (error) {
    console.error('API status check failed:', error);
    throw error;
  }
};

export default {
  getMarketData,
  getPortfolio,
  getAIRecommendations,
  getStakingData,
  getLatestNews,
  executeTransaction,
  executeStrategy,
  getRebalanceStatus,
  updateRebalanceSettings,
  checkApiStatus,
  clearCache
};