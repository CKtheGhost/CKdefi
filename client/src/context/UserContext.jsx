import React, { createContext, useState, useEffect, useCallback } from 'react';

// Define user preference keys
export const USER_PREFERENCES = {
  RISK_PROFILE: 'riskProfile',
  AUTO_REBALANCE: 'autoRebalance',
  REBALANCE_THRESHOLD: 'rebalanceThreshold',
  NOTIFICATION_PREFERENCES: 'notificationPreferences',
  DASHBOARD_LAYOUT: 'dashboardLayout',
  DATA_VIEW: 'dataView'
};

// Define default values
const DEFAULT_PREFERENCES = {
  [USER_PREFERENCES.RISK_PROFILE]: 'balanced', // conservative, balanced, aggressive
  [USER_PREFERENCES.AUTO_REBALANCE]: false,
  [USER_PREFERENCES.REBALANCE_THRESHOLD]: 5, // Percentage threshold to trigger rebalance
  [USER_PREFERENCES.NOTIFICATION_PREFERENCES]: {
    transactions: true,
    priceAlerts: true,
    newsletterUpdates: false,
    securityAlerts: true
  },
  [USER_PREFERENCES.DASHBOARD_LAYOUT]: 'default',
  [USER_PREFERENCES.DATA_VIEW]: 'chart' // chart or table
};

// Create the context
export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  // User profile state
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // User preferences
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  
  // Transaction history
  const [transactionHistory, setTransactionHistory] = useState([]);
  
  // Strategy history
  const [strategyHistory, setStrategyHistory] = useState([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    // Load user preferences
    const storedPreferences = localStorage.getItem('userPreferences');
    if (storedPreferences) {
      try {
        const parsedPreferences = JSON.parse(storedPreferences);
        setPreferences(prev => ({
          ...prev,
          ...parsedPreferences
        }));
      } catch (error) {
        console.error('Error parsing user preferences:', error);
      }
    }
    
    // Load transaction history
    const storedTransactionHistory = localStorage.getItem('transactionHistory');
    if (storedTransactionHistory) {
      try {
        setTransactionHistory(JSON.parse(storedTransactionHistory));
      } catch (error) {
        console.error('Error parsing transaction history:', error);
      }
    }
    
    // Load strategy history
    const storedStrategyHistory = localStorage.getItem('strategyHistory');
    if (storedStrategyHistory) {
      try {
        setStrategyHistory(JSON.parse(storedStrategyHistory));
      } catch (error) {
        console.error('Error parsing strategy history:', error);
      }
    }
    
    // Check for logged in user
    const storedUserProfile = localStorage.getItem('userProfile');
    if (storedUserProfile) {
      try {
        setUserProfile(JSON.parse(storedUserProfile));
        setIsLoggedIn(true);
      } catch (error) {
        console.error('Error parsing user profile:', error);
      }
    }
  }, []);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Save transaction history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  // Save strategy history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('strategyHistory', JSON.stringify(strategyHistory));
  }, [strategyHistory]);

  // Update a single preference
  const updatePreference = useCallback((key, value) => {
    if (Object.values(USER_PREFERENCES).includes(key)) {
      setPreferences(prev => ({
        ...prev,
        [key]: value
      }));
    }
  }, []);

  // Reset preferences to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Add a transaction to history
  const addTransaction = useCallback((transaction) => {
    setTransactionHistory(prev => {
      // Add transaction with timestamp
      const txWithTimestamp = {
        ...transaction,
        timestamp: transaction.timestamp || Date.now()
      };
      
      // Limit history to most recent 100 transactions
      return [txWithTimestamp, ...prev].slice(0, 100);
    });
  }, []);

  // Clear transaction history
  const clearTransactionHistory = useCallback(() => {
    setTransactionHistory([]);
  }, []);

  // Add a strategy to history
  const addStrategy = useCallback((strategy) => {
    setStrategyHistory(prev => {
      // Add strategy with timestamp
      const strategyWithTimestamp = {
        ...strategy,
        timestamp: strategy.timestamp || Date.now()
      };
      
      // Limit history to most recent 50 strategies
      return [strategyWithTimestamp, ...prev].slice(0, 50);
    });
  }, []);

  // Clear strategy history
  const clearStrategyHistory = useCallback(() => {
    setStrategyHistory([]);
  }, []);

  // Login user
  const login = useCallback(async (credentials) => {
    try {
      // In a real app, this would make an API call
      // This is a simplified mock for now
      const mockProfile = {
        id: 'user-123',
        email: credentials.email,
        name: 'Demo User',
        createdAt: new Date().toISOString()
      };
      
      setUserProfile(mockProfile);
      setIsLoggedIn(true);
      
      // Save to localStorage
      localStorage.setItem('userProfile', JSON.stringify(mockProfile));
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to login'
      };
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUserProfile(null);
    setIsLoggedIn(false);
    
    // Remove from localStorage
    localStorage.removeItem('userProfile');
  }, []);

  // Context value
  const value = {
    // User authentication
    userProfile,
    isLoggedIn,
    login,
    logout,
    
    // User preferences
    preferences,
    updatePreference,
    resetPreferences,
    
    // Transaction history
    transactionHistory,
    addTransaction,
    clearTransactionHistory,
    
    // Strategy history
    strategyHistory,
    addStrategy,
    clearStrategyHistory,
    
    // User preference getters (convenience methods)
    getRiskProfile: () => preferences[USER_PREFERENCES.RISK_PROFILE],
    isAutoRebalanceEnabled: () => preferences[USER_PREFERENCES.AUTO_REBALANCE],
    getRebalanceThreshold: () => preferences[USER_PREFERENCES.REBALANCE_THRESHOLD],
    getNotificationSettings: () => preferences[USER_PREFERENCES.NOTIFICATION_PREFERENCES],
    getDashboardLayout: () => preferences[USER_PREFERENCES.DASHBOARD_LAYOUT],
    getDataViewPreference: () => preferences[USER_PREFERENCES.DATA_VIEW]
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook to use the user context
export const useUser = () => {
  const context = React.useContext(UserContext);
  if (context === null) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};