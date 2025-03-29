import React, { createContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import { useWallet } from '../hooks/useWallet';

// Create the context
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const { wallet, connected, signMessage } = useWallet();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [preferences, setPreferences] = useState({
    riskProfile: 'balanced',
    theme: 'system',
    autoRebalance: false,
    rebalancingThreshold: 5,
    preserveStakedPositions: true,
    dashboard: {
      favoriteProtocols: [],
      defaultSection: 'market-overview'
    },
    notifications: {
      email: true,
      push: true,
      rebalance: true,
      priceAlert: true
    },
    aiSettings: {
      preferredModel: 'auto',
      autoRecommend: true
    }
  });

  // Load user data from local storage on initial render
  useEffect(() => {
    const storedUser = localStorage.getItem('compoundefi_user');
    const storedPreferences = localStorage.getItem('compoundefi_preferences');
    
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user data', e);
        localStorage.removeItem('compoundefi_user');
      }
    }
    
    if (storedPreferences) {
      try {
        setPreferences(JSON.parse(storedPreferences));
      } catch (e) {
        console.error('Failed to parse stored preferences', e);
        localStorage.removeItem('compoundefi_preferences');
      }
    }
    
    setLoading(false);
  }, []);

  // Auto-connect if wallet is available and user was previously authenticated
  useEffect(() => {
    if (connected && wallet?.address && localStorage.getItem('compoundefi_token')) {
      getUserProfile(wallet.address);
    }
  }, [connected, wallet?.address]);

  // Register/authenticate user with wallet
  const registerUser = useCallback(async () => {
    if (!connected || !wallet?.address) {
      setError('Wallet not connected');
      return false;
    }

    try {
      setLoading(true);
      // Generate a unique message to sign
      const message = `Sign this message to verify your wallet ownership: ${Date.now()}`;
      
      // Request signature from wallet
      const signature = await signMessage(message);
      
      if (!signature) {
        throw new Error('Failed to sign message with wallet');
      }
      
      // Register with backend
      const response = await api.post('/auth/wallet-verify', {
        walletAddress: wallet.address,
        signature,
        message
      });
      
      if (response.data.success) {
        const { token, user: userData } = response.data;
        
        // Store token and user data
        localStorage.setItem('compoundefi_token', token);
        localStorage.setItem('compoundefi_user', JSON.stringify(userData));
        
        // Update state
        setUser(userData);
        
        // Load user preferences
        if (userData.preferences) {
          setPreferences({
            ...preferences,
            ...userData.preferences
          });
          localStorage.setItem('compoundefi_preferences', JSON.stringify({
            ...preferences,
            ...userData.preferences
          }));
        }
        
        return true;
      } else {
        throw new Error(response.data.error || 'Authentication failed');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Failed to register with wallet');
      return false;
    } finally {
      setLoading(false);
    }
  }, [connected, wallet, signMessage, preferences]);

  // Get user profile data
  const getUserProfile = useCallback(async (address) => {
    try {
      setLoading(true);
      const response = await api.get(`/user/profile`);
      
      if (response.data.success) {
        const { user: userData } = response.data;
        
        // Update state and storage
        setUser(userData);
        localStorage.setItem('compoundefi_user', JSON.stringify(userData));
        
        // Update preferences if available
        if (userData.preferences) {
          setPreferences({
            ...preferences,
            ...userData.preferences
          });
          localStorage.setItem('compoundefi_preferences', JSON.stringify({
            ...preferences,
            ...userData.preferences
          }));
        }
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError('Failed to load user profile');
    } finally {
      setLoading(false);
    }
  }, [preferences]);

  // Update user preferences
  const updatePreferences = useCallback(async (newPreferences) => {
    try {
      setLoading(true);
      
      // Merge with existing preferences
      const updatedPreferences = {
        ...preferences,
        ...newPreferences
      };
      
      // Update on server if authenticated
      if (user) {
        await api.post('/user/preferences', { preferences: updatedPreferences });
      }
      
      // Update local state and storage
      setPreferences(updatedPreferences);
      localStorage.setItem('compoundefi_preferences', JSON.stringify(updatedPreferences));
      
      return true;
    } catch (err) {
      console.error('Error updating preferences:', err);
      setError('Failed to update preferences');
      return false;
    } finally {
      setLoading(false);
    }
  }, [preferences, user]);

  // Logout user
  const logout = useCallback(() => {
    // Remove token and user data from storage
    localStorage.removeItem('compoundefi_token');
    localStorage.removeItem('compoundefi_user');
    
    // Reset state
    setUser(null);
    
    // Keep preferences
    return true;
  }, []);

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Context value
  const value = {
    user,
    loading,
    error,
    preferences,
    isAuthenticated,
    registerUser,
    getUserProfile,
    updatePreferences,
    logout
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;