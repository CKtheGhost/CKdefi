// src/services/storageService.js

/**
 * Service for handling local storage and user preference management
 * for CompounDefi application
 */
class StorageService {
  /**
   * Constructor initializes storage prefix
   */
  constructor() {
    this.prefix = 'compoundefi_';
    this.expiryPrefix = 'expires_';
    
    // Initialize storage functionality check
    this.storageAvailable = this.checkStorageAvailability();
  }
  
  /**
   * Check if localStorage is available
   * @returns {boolean} True if localStorage is available
   */
  checkStorageAvailability() {
    try {
      const testKey = `${this.prefix}test`;
      localStorage.setItem(testKey, 'test');
      const result = localStorage.getItem(testKey) === 'test';
      localStorage.removeItem(testKey);
      return result;
    } catch (e) {
      return false;
    }
  }
  
  /**
   * Get an item from localStorage with the application prefix
   * @param {string} key - Key to retrieve
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value (parsed from JSON) or defaultValue
   */
  get(key, defaultValue = null) {
    if (!this.storageAvailable) return defaultValue;
    
    const prefixedKey = `${this.prefix}${key}`;
    const expiryKey = `${this.prefix}${this.expiryPrefix}${key}`;
    
    // Check if the item has expired
    const expiryTimestamp = localStorage.getItem(expiryKey);
    if (expiryTimestamp && parseInt(expiryTimestamp) < Date.now()) {
      // Item has expired, remove it
      localStorage.removeItem(prefixedKey);
      localStorage.removeItem(expiryKey);
      return defaultValue;
    }
    
    const value = localStorage.getItem(prefixedKey);
    if (value === null) return defaultValue;
    
    try {
      return JSON.parse(value);
    } catch (e) {
      // If parsing fails, return the raw value
      return value;
    }
  }
  
  /**
   * Set an item in localStorage with the application prefix
   * @param {string} key - Key to set
   * @param {*} value - Value to store (will be stringified to JSON)
   * @param {number} expiresInMs - Optional expiration time in milliseconds
   * @returns {boolean} True if successful
   */
  set(key, value, expiresInMs = null) {
    if (!this.storageAvailable) return false;
    
    const prefixedKey = `${this.prefix}${key}`;
    
    try {
      const valueToStore = typeof value === 'object' ? JSON.stringify(value) : value;
      localStorage.setItem(prefixedKey, valueToStore);
      
      // Set expiration if specified
      if (expiresInMs) {
        const expiryKey = `${this.prefix}${this.expiryPrefix}${key}`;
        const expiryTime = Date.now() + expiresInMs;
        localStorage.setItem(expiryKey, expiryTime.toString());
      }
      
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }
  
  /**
   * Remove an item from localStorage
   * @param {string} key - Key to remove
   * @returns {boolean} True if successful
   */
  remove(key) {
    if (!this.storageAvailable) return false;
    
    const prefixedKey = `${this.prefix}${key}`;
    const expiryKey = `${this.prefix}${this.expiryPrefix}${key}`;
    
    try {
      localStorage.removeItem(prefixedKey);
      localStorage.removeItem(expiryKey);
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }
  
  /**
   * Clear all application data from localStorage
   * @returns {boolean} True if successful
   */
  clearAll() {
    if (!this.storageAvailable) return false;
    
    try {
      // Only remove items with our prefix
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(this.prefix)) {
          localStorage.removeItem(key);
        }
      });
      return true;
    } catch (e) {
      console.error('Storage error:', e);
      return false;
    }
  }
  
  /**
   * Save wallet connection information
   * @param {string} address - Wallet address
   * @returns {boolean} True if successful
   */
  saveWalletConnection(address) {
    if (!address) return false;
    
    return this.set('connectedWallet', address) && 
           this.set('walletLastConnected', Date.now());
  }
  
  /**
   * Get connected wallet address
   * @returns {string|null} Wallet address or null
   */
  getConnectedWallet() {
    return this.get('connectedWallet');
  }
  
  /**
   * Remove wallet connection information
   * @returns {boolean} True if successful
   */
  clearWalletConnection() {
    return this.remove('connectedWallet') && 
           this.remove('walletLastConnected');
  }
  
  /**
   * Save user profile data
   * @param {Object} profile - User profile data
   * @returns {boolean} True if successful
   */
  saveUserProfile(profile) {
    if (!profile) return false;
    
    return this.set('userProfile', profile);
  }
  
  /**
   * Get user profile data
   * @returns {Object|null} User profile or null
   */
  getUserProfile() {
    return this.get('userProfile');
  }
  
  /**
   * Save user preferences
   * @param {Object} preferences - User preferences
   * @returns {boolean} True if successful
   */
  saveUserPreferences(preferences) {
    if (!preferences) return false;
    
    return this.set('userPreferences', preferences);
  }
  
  /**
   * Get user preferences
   * @returns {Object} User preferences or default
   */
  getUserPreferences() {
    return this.get('userPreferences', {
      riskProfile: 'balanced',
      darkMode: true,
      autoOptimize: false,
      notificationsEnabled: true,
      activeSection: 'market-overview'
    });
  }
  
  /**
   * Save recommendation history
   * @param {Array} recommendations - Array of recommendations
   * @param {number} limit - Maximum number to store
   * @returns {boolean} True if successful
   */
  saveRecommendationHistory(recommendations, limit = 10) {
    if (!Array.isArray(recommendations)) return false;
    
    // Limit the number of stored recommendations
    const limitedHistory = recommendations.slice(0, limit);
    return this.set('recommendationHistory', limitedHistory);
  }
  
  /**
   * Get recommendation history
   * @returns {Array} Recommendation history
   */
  getRecommendationHistory() {
    return this.get('recommendationHistory', []);
  }
  
  /**
   * Save a new recommendation to history
   * @param {Object} recommendation - New recommendation to save
   * @param {number} limit - Maximum number to store
   * @returns {boolean} True if successful
   */
  addRecommendationToHistory(recommendation, limit = 10) {
    if (!recommendation) return false;
    
    const history = this.getRecommendationHistory();
    
    // Add timestamp if not present
    if (!recommendation.timestamp) {
      recommendation.timestamp = new Date().toISOString();
    }
    
    // Add to beginning of array and limit size
    const updatedHistory = [recommendation, ...history].slice(0, limit);
    return this.saveRecommendationHistory(updatedHistory);
  }
  
  /**
   * Save auto-optimizer settings
   * @param {Object} settings - Auto-optimizer settings
   * @returns {boolean} True if successful
   */
  saveOptimizerSettings(settings) {
    if (!settings) return false;
    
    return this.set('optimizerSettings', settings);
  }
  
  /**
   * Get auto-optimizer settings
   * @returns {Object} Auto-optimizer settings or default
   */
  getOptimizerSettings() {
    return this.get('optimizerSettings', {
      enabled: false,
      interval: 24, // hours
      rebalanceThreshold: 5, // percent
      maxSlippage: 1, // percent
      preserveStakedPositions: true
    });
  }
  
  /**
   * Save rebalance history
   * @param {Array} history - Rebalance history
   * @param {number} limit - Maximum number to store
   * @returns {boolean} True if successful
   */
  saveRebalanceHistory(history, limit = 20) {
    if (!Array.isArray(history)) return false;
    
    // Limit the number of stored entries
    const limitedHistory = history.slice(0, limit);
    return this.set('rebalanceHistory', limitedHistory);
  }
  
  /**
   * Get rebalance history
   * @returns {Array} Rebalance history
   */
  getRebalanceHistory() {
    return this.get('rebalanceHistory', []);
  }
  
  /**
   * Add entry to rebalance history
   * @param {Object} entry - New history entry
   * @param {number} limit - Maximum number to store
   * @returns {boolean} True if successful
   */
  addRebalanceHistoryEntry(entry, limit = 20) {
    if (!entry) return false;
    
    const history = this.getRebalanceHistory();
    
    // Add timestamp if not present
    if (!entry.timestamp) {
      entry.timestamp = new Date().toISOString();
    }
    
    // Add to beginning of array and limit size
    const updatedHistory = [entry, ...history].slice(0, limit);
    return this.saveRebalanceHistory(updatedHistory);
  }
  
  /**
   * Get cache TTL settings
   * @returns {Object} Cache TTL settings in milliseconds
   */
  getCacheTTLSettings() {
    return this.get('cacheTTL', {
      stakingData: 10 * 60 * 1000, // 10 minutes
      marketData: 5 * 60 * 1000,   // 5 minutes
      newsData: 15 * 60 * 1000,    // 15 minutes
      portfolioData: 2 * 60 * 1000 // 2 minutes
    });
  }
}

// Create and export instance
const storageService = new StorageService();
export default storageService;