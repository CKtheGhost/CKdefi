// Nexus-level UserContext.jsx
// Original user preference logic with robust logging, error handling,
// plus an easy approach to login/logout and preference management.

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';

export const USER_PREFERENCES = {
  RISK_PROFILE: 'riskProfile',
  AUTO_REBALANCE: 'autoRebalance',
  REBALANCE_THRESHOLD: 'rebalanceThreshold',
  NOTIFICATION_PREFERENCES: 'notificationPreferences',
  DASHBOARD_LAYOUT: 'dashboardLayout',
  DATA_VIEW: 'dataView',
};

const DEFAULT_PREFERENCES = {
  [USER_PREFERENCES.RISK_PROFILE]: 'balanced',
  [USER_PREFERENCES.AUTO_REBALANCE]: false,
  [USER_PREFERENCES.REBALANCE_THRESHOLD]: 5,
  [USER_PREFERENCES.NOTIFICATION_PREFERENCES]: {
    transactions: true,
    priceAlerts: true,
    newsletterUpdates: false,
    securityAlerts: true,
  },
  [USER_PREFERENCES.DASHBOARD_LAYOUT]: 'default',
  [USER_PREFERENCES.DATA_VIEW]: 'chart',
};

export const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const [userProfile, setUserProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [strategyHistory, setStrategyHistory] = useState([]);

  // On mount, load data from localStorage
  useEffect(() => {
    try {
      const storedPrefs = localStorage.getItem('userPreferences');
      if (storedPrefs) {
        const parsed = JSON.parse(storedPrefs);
        setPreferences((prev) => ({ ...prev, ...parsed }));
      }
    } catch (err) {
      console.error('[UserContext] Error parsing user preferences:', err);
    }

    try {
      const storedTxs = localStorage.getItem('transactionHistory');
      if (storedTxs) {
        setTransactionHistory(JSON.parse(storedTxs));
      }
    } catch (err) {
      console.error('[UserContext] Error parsing transaction history:', err);
    }

    try {
      const storedStrategies = localStorage.getItem('strategyHistory');
      if (storedStrategies) {
        setStrategyHistory(JSON.parse(storedStrategies));
      }
    } catch (err) {
      console.error('[UserContext] Error parsing strategy history:', err);
    }

    try {
      const storedProfile = localStorage.getItem('userProfile');
      if (storedProfile) {
        const parsedProf = JSON.parse(storedProfile);
        setUserProfile(parsedProf);
        setIsLoggedIn(true);
      }
    } catch (err) {
      console.error('[UserContext] Error parsing user profile:', err);
    }
  }, []);

  // Persist preferences
  useEffect(() => {
    localStorage.setItem('userPreferences', JSON.stringify(preferences));
  }, [preferences]);

  // Persist transaction history
  useEffect(() => {
    localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
  }, [transactionHistory]);

  // Persist strategy history
  useEffect(() => {
    localStorage.setItem('strategyHistory', JSON.stringify(strategyHistory));
  }, [strategyHistory]);

  // Update a single preference
  const updatePreference = useCallback((key, value) => {
    if (Object.values(USER_PREFERENCES).includes(key)) {
      setPreferences((prev) => ({ ...prev, [key]: value }));
    } else {
      console.warn(`[UserContext] Attempted to update unknown preference key: ${key}`);
    }
  }, []);

  // Reset all preferences to defaults
  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  // Add a new transaction
  const addTransaction = useCallback((tx) => {
    const withTime = { ...tx, timestamp: tx.timestamp || Date.now() };
    setTransactionHistory((prev) => [withTime, ...prev].slice(0, 100));
  }, []);

  // Clear all transaction history
  const clearTransactionHistory = useCallback(() => {
    setTransactionHistory([]);
  }, []);

  // Add a new strategy
  const addStrategy = useCallback((strategy) => {
    const withTime = { ...strategy, timestamp: strategy.timestamp || Date.now() };
    setStrategyHistory((prev) => [withTime, ...prev].slice(0, 50));
  }, []);

  // Clear all strategy history
  const clearStrategyHistory = useCallback(() => {
    setStrategyHistory([]);
  }, []);

  // Mock login
  const login = useCallback(async (creds) => {
    try {
      // In a real setup: call backend
      const mockProfile = {
        id: 'user-123',
        email: creds.email,
        name: 'Demo User',
        createdAt: new Date().toISOString(),
      };
      setUserProfile(mockProfile);
      setIsLoggedIn(true);
      localStorage.setItem('userProfile', JSON.stringify(mockProfile));
      return { success: true };
    } catch (err) {
      console.error('[UserContext] Login error:', err);
      return { success: false, error: err.message || 'Login failed' };
    }
  }, []);

  // Logout user
  const logout = useCallback(() => {
    setUserProfile(null);
    setIsLoggedIn(false);
    localStorage.removeItem('userProfile');
  }, []);

  const value = {
    userProfile,
    isLoggedIn,
    login,
    logout,

    preferences,
    updatePreference,
    resetPreferences,

    transactionHistory,
    addTransaction,
    clearTransactionHistory,

    strategyHistory,
    addStrategy,
    clearStrategyHistory,

    getRiskProfile: () => preferences[USER_PREFERENCES.RISK_PROFILE],
    isAutoRebalanceEnabled: () => preferences[USER_PREFERENCES.AUTO_REBALANCE],
    getRebalanceThreshold: () => preferences[USER_PREFERENCES.REBALANCE_THRESHOLD],
    getNotificationSettings: () => preferences[USER_PREFERENCES.NOTIFICATION_PREFERENCES],
    getDashboardLayout: () => preferences[USER_PREFERENCES.DASHBOARD_LAYOUT],
    getDataViewPreference: () => preferences[USER_PREFERENCES.DATA_VIEW],
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

// Custom hook
export const useUser = () => {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('[useUser] must be used within a UserProvider');
  }
  return ctx;
};
