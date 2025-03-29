// client/src/services/storageService.js
// Service for managing client-side storage and persistence

/**
 * Service for handling client-side storage operations
 */
const storageService = {
  /**
   * Save data to local storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  saveToLocalStorage(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      localStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to localStorage [${key}]:`, error);
      return false;
    }
  },

  /**
   * Retrieve data from local storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Retrieved value or default
   */
  getFromLocalStorage(key, defaultValue = null) {
    try {
      const serializedValue = localStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(`Error retrieving from localStorage [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * Remove item from local storage
   * @param {string} key - Storage key
   * @returns {boolean} Success status
   */
  removeFromLocalStorage(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from localStorage [${key}]:`, error);
      return false;
    }
  },

  /**
   * Clear all local storage data for the app
   * @returns {boolean} Success status
   */
  clearAllLocalStorage() {
    try {
      // Only clear keys with our prefix to avoid clearing other app data
      const keysToRemove = Object.keys(localStorage).filter(key => 
        key.startsWith('compoundefi_')
      );
      
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing localStorage:', error);
      return false;
    }
  },

  /**
   * Save data to session storage
   * @param {string} key - Storage key
   * @param {any} value - Value to store
   * @returns {boolean} Success status
   */
  saveToSessionStorage(key, value) {
    try {
      const serializedValue = JSON.stringify(value);
      sessionStorage.setItem(key, serializedValue);
      return true;
    } catch (error) {
      console.error(`Error saving to sessionStorage [${key}]:`, error);
      return false;
    }
  },

  /**
   * Retrieve data from session storage
   * @param {string} key - Storage key
   * @param {any} defaultValue - Default value if not found
   * @returns {any} Retrieved value or default
   */
  getFromSessionStorage(key, defaultValue = null) {
    try {
      const serializedValue = sessionStorage.getItem(key);
      if (serializedValue === null) {
        return defaultValue;
      }
      return JSON.parse(serializedValue);
    } catch (error) {
      console.error(`Error retrieving from sessionStorage [${key}]:`, error);
      return defaultValue;
    }
  },

  /**
   * Save user preferences
   * @param {string} walletAddress - User wallet address
   * @param {Object} preferences - User preferences
   * @returns {boolean} Success status
   */
  saveUserPreferences(walletAddress, preferences) {
    return this.saveToLocalStorage(`compoundefi_preferences_${walletAddress}`, preferences);
  },

  /**
   * Get user preferences
   * @param {string} walletAddress - User wallet address
   * @returns {Object} User preferences
   */
  getUserPreferences(walletAddress) {
    const defaultPreferences = {
      theme: 'system', // system, light, dark
      riskProfile: 'balanced', // conservative, balanced, aggressive
      autoRebalance: false,
      preserveStakedPositions: true,
      notificationsEnabled: true,
      dashboardLayout: 'default'
    };
    
    return this.getFromLocalStorage(`compoundefi_preferences_${walletAddress}`, defaultPreferences);
  },

  /**
   * Save auth token
   * @param {string} token - Auth token
   * @param {string} walletAddress - User wallet address
   * @returns {boolean} Success status
   */
  saveAuthToken(token, walletAddress) {
    const tokenData = {
      token,
      walletAddress,
      timestamp: Date.now()
    };
    
    return this.saveToLocalStorage('compoundefi_auth', tokenData);
  },

  /**
   * Get auth token
   * @returns {Object|null} Auth token data or null if expired/not found
   */
  getAuthToken() {
    const tokenData = this.getFromLocalStorage('compoundefi_auth', null);
    
    if (!tokenData) {
      return null;
    }
    
    // Check if token is expired (24 hours)
    const now = Date.now();
    const expiry = tokenData.timestamp + (24 * 60 * 60 * 1000);
    
    if (now > expiry) {
      this.removeFromLocalStorage('compoundefi_auth');
      return null;
    }
    
    return tokenData;
  },

  /**
   * Store last used wallet
   * @param {string} walletType - Wallet type (e.g., 'petra', 'martian')
   * @param {string} walletAddress - Wallet address
   * @returns {boolean} Success status
   */
  saveWalletInfo(walletType, walletAddress) {
    return this.saveToLocalStorage('compoundefi_wallet', {
      type: walletType,
      address: walletAddress,
      lastConnected: Date.now()
    });
  },

  /**
   * Get last used wallet info
   * @returns {Object|null} Wallet info or null
   */
  getWalletInfo() {
    return this.getFromLocalStorage('compoundefi_wallet', null);
  },

  /**
   * Cache recommendation for a wallet
   * @param {string} walletAddress - Wallet address
   * @param {string} riskProfile - Risk profile
   * @param {Object} recommendation - Recommendation data
   * @returns {boolean} Success status
   */
  cacheRecommendation(walletAddress, riskProfile, recommendation) {
    return this.saveToLocalStorage(
      `compoundefi_rec_${walletAddress}_${riskProfile}`, 
      {
        data: recommendation,
        timestamp: Date.now()
      }
    );
  },

  /**
   * Get cached recommendation
   * @param {string} walletAddress - Wallet address
   * @param {string} riskProfile - Risk profile
   * @returns {Object|null} Cached recommendation or null if expired/not found
   */
  getCachedRecommendation(walletAddress, riskProfile) {
    const cached = this.getFromLocalStorage(
      `compoundefi_rec_${walletAddress}_${riskProfile}`, 
      null
    );
    
    if (!cached) {
      return null;
    }
    
    // Check if cache is expired (30 minutes)
    const now = Date.now();
    const expiry = cached.timestamp + (30 * 60 * 1000);
    
    if (now > expiry) {
      return null;
    }
    
    return cached.data;
  },

  /**
   * Save notification settings
   * @param {string} walletAddress - Wallet address
   * @param {Object} settings - Notification settings
   * @returns {boolean} Success status
   */
  saveNotificationSettings(walletAddress, settings) {
    return this.saveToLocalStorage(`compoundefi_notifications_${walletAddress}`, settings);
  },

  /**
   * Get notification settings
   * @param {string} walletAddress - Wallet address
   * @returns {Object} Notification settings
   */
  getNotificationSettings(walletAddress) {
    const defaultSettings = {
      enabled: true,
      email: true,
      push: true,
      rebalance: true,
      priceAlert: true,
      newsletter: false
    };
    
    return this.getFromLocalStorage(`compoundefi_notifications_${walletAddress}`, defaultSettings);
  },

  /**
   * Save auto-rebalance settings
   * @param {string} walletAddress - Wallet address
   * @param {Object} settings - Auto-rebalance settings
   * @returns {boolean} Success status
   */
  saveAutoRebalanceSettings(walletAddress, settings) {
    return this.saveToLocalStorage(`compoundefi_rebalance_${walletAddress}`, settings);
  },

  /**
   * Get auto-rebalance settings
   * @param {string} walletAddress - Wallet address
   * @returns {Object} Auto-rebalance settings
   */
  getAutoRebalanceSettings(walletAddress) {
    const defaultSettings = {
      enabled: false,
      threshold: 5, // 5% drift
      interval: 'weekly',
      slippage: 2.0, // 2% max slippage
      preserveStakedPositions: true
    };
    
    return this.getFromLocalStorage(`compoundefi_rebalance_${walletAddress}`, defaultSettings);
  },

  /**
   * Track recently viewed recommendations
   * @param {string} walletAddress - Wallet address
   * @param {Object} recommendation - Recommendation summary
   * @returns {boolean} Success status
   */
  trackRecentRecommendation(walletAddress, recommendation) {
    const recentRecs = this.getFromLocalStorage(
      `compoundefi_recent_recs_${walletAddress}`, 
      []
    );
    
    // Create a summary object to save space
    const summary = {
      id: recommendation.id || Date.now().toString(),
      title: recommendation.title,
      riskProfile: recommendation.riskProfile,
      totalApr: recommendation.totalApr,
      timestamp: Date.now()
    };
    
    // Add to the beginning of the array
    recentRecs.unshift(summary);
    
    // Keep only the most recent 10
    const updated = recentRecs.slice(0, 10);
    
    return this.saveToLocalStorage(`compoundefi_recent_recs_${walletAddress}`, updated);
  },

  /**
   * Get recently viewed recommendations
   * @param {string} walletAddress - Wallet address
   * @returns {Array} Recent recommendations
   */
  getRecentRecommendations(walletAddress) {
    return this.getFromLocalStorage(`compoundefi_recent_recs_${walletAddress}`, []);
  }
};

export default storageService;