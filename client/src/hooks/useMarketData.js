import { useState, useEffect, useContext, useCallback } from 'react';
import axios from 'axios';
import { NotificationContext } from '../context/NotificationContext';
import { DataContext } from '../context/DataContext';

/**
 * Custom hook for fetching and managing market data
 * Handles staking rates, token prices, news, and protocol comparisons
 */
const useMarketData = () => {
  const { setNotification } = useContext(NotificationContext);
  const { setMarketData } = useContext(DataContext);
  
  // Local state for loading indicators and error handling
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [refreshIntervals, setRefreshIntervals] = useState({
    stakingRates: 10 * 60 * 1000, // 10 minutes
    tokenPrices: 3 * 60 * 1000,   // 3 minutes
    news: 15 * 60 * 1000,         // 15 minutes
    protocols: 30 * 60 * 1000     // 30 minutes
  });

  // State for different data types
  const [stakingRates, setStakingRates] = useState({});
  const [tokenPrices, setTokenPrices] = useState({});
  const [news, setNews] = useState([]);
  const [protocols, setProtocols] = useState({});
  const [strategies, setStrategies] = useState([]);

  /**
   * Fetch all market data
   */
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch data in parallel for better performance
      const [stakingResponse, tokensResponse, newsResponse, protocolsResponse] = await Promise.all([
        axios.get('/api/staking/rates'),
        axios.get('/api/tokens/latest'),
        axios.get('/api/news/latest'),
        axios.get('/api/protocols')
      ]);
      
      // Update individual data states
      setStakingRates(stakingResponse.data.protocols || {});
      setTokenPrices(tokensResponse.data.coins || []);
      setNews(newsResponse.data.articles || []);
      setProtocols(protocolsResponse.data.protocols || {});
      
      // If strategies are included in staking response
      if (stakingResponse.data.strategies) {
        setStrategies(stakingResponse.data.strategies);
      }
      
      // Update last updated timestamp
      setLastUpdated(new Date().toISOString());
      
      // Update global market data context
      setMarketData({
        stakingRates: stakingResponse.data.protocols || {},
        tokenPrices: tokensResponse.data.coins || [],
        news: newsResponse.data.articles || [],
        protocols: protocolsResponse.data.protocols || {},
        strategies: stakingResponse.data.strategies || [],
        lastUpdated: new Date().toISOString()
      });
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to fetch market data');
      setNotification({
        type: 'error',
        message: 'Failed to fetch market data. Please try again later.'
      });
      setLoading(false);
    }
  }, [setNotification, setMarketData]);

  /**
   * Refresh staking rates data
   */
  const refreshStakingRates = useCallback(async () => {
    try {
      const response = await axios.get('/api/staking/rates');
      setStakingRates(response.data.protocols || {});
      
      if (response.data.strategies) {
        setStrategies(response.data.strategies);
      }
      
      setLastUpdated(new Date().toISOString());
      return response.data;
    } catch (err) {
      console.error('Error refreshing staking rates:', err);
      setNotification({
        type: 'error',
        message: 'Failed to refresh staking rates'
      });
      throw err;
    }
  }, [setNotification]);

  /**
   * Refresh token prices data
   */
  const refreshTokenPrices = useCallback(async () => {
    try {
      const response = await axios.get('/api/tokens/latest');
      setTokenPrices(response.data.coins || []);
      setLastUpdated(new Date().toISOString());
      return response.data;
    } catch (err) {
      console.error('Error refreshing token prices:', err);
      setNotification({
        type: 'error',
        message: 'Failed to refresh token prices'
      });
      throw err;
    }
  }, [setNotification]);

  /**
   * Refresh news data
   */
  const refreshNews = useCallback(async () => {
    try {
      const response = await axios.get('/api/news/latest');
      setNews(response.data.articles || []);
      setLastUpdated(new Date().toISOString());
      return response.data;
    } catch (err) {
      console.error('Error refreshing news:', err);
      setNotification({
        type: 'error',
        message: 'Failed to refresh news'
      });
      throw err;
    }
  }, [setNotification]);

  /**
   * Get the price of a specific token
   * @param {string} tokenId - Token identifier (e.g., 'aptos')
   * @returns {Promise<number>} - Token price
   */
  const getTokenPrice = useCallback(async (tokenId) => {
    try {
      // Check if we already have the price in local state
      const tokenData = tokenPrices.find(token => 
        token.id?.toLowerCase() === tokenId.toLowerCase() || 
        token.symbol?.toLowerCase() === tokenId.toLowerCase()
      );
      
      if (tokenData?.price) {
        return tokenData.price;
      }
      
      // If not, fetch it from the API
      const response = await axios.get(`/api/tokens/price/${tokenId}`);
      
      if (response.data && response.data.price) {
        return response.data.price;
      }
      
      throw new Error(`Could not get price for ${tokenId}`);
    } catch (err) {
      console.error(`Error getting price for ${tokenId}:`, err);
      // Default fallbacks for common tokens
      if (tokenId.toLowerCase() === 'aptos' || tokenId.toLowerCase() === 'apt') {
        return 10.50; // Default APT price
      }
      throw err;
    }
  }, [tokenPrices]);

  /**
   * Compare APY/APR rates across protocols
   * @returns {Object} Comparison data for visualization
   */
  const compareProtocolRates = useCallback(() => {
    const comparison = {
      protocols: [],
      rates: [],
      bestApr: 0,
      bestProtocol: ''
    };
    
    try {
      // Extract protocols and their staking APRs
      Object.entries(stakingRates).forEach(([protocol, data]) => {
        if (data.staking && data.staking.apr) {
          const apr = parseFloat(data.staking.apr);
          comparison.protocols.push(protocol);
          comparison.rates.push(apr);
          
          if (apr > comparison.bestApr) {
            comparison.bestApr = apr;
            comparison.bestProtocol = protocol;
          }
        }
      });
      
      return comparison;
    } catch (err) {
      console.error('Error comparing protocol rates:', err);
      return comparison;
    }
  }, [stakingRates]);

  /**
   * Get recommended strategy based on risk profile
   * @param {string} riskProfile - User's risk profile (conservative, balanced, aggressive)
   * @returns {Object} Recommended strategy
   */
  const getRecommendedStrategy = useCallback((riskProfile = 'balanced') => {
    try {
      // Filter strategies by risk profile
      const matchingStrategies = strategies.filter(strategy => 
        strategy.riskProfile?.toLowerCase() === riskProfile.toLowerCase()
      );
      
      if (matchingStrategies.length > 0) {
        // Sort by APR (highest first)
        return matchingStrategies.sort((a, b) => parseFloat(b.apr) - parseFloat(a.apr))[0];
      }
      
      // If no matching strategies, return the first one or null
      return strategies.length > 0 ? strategies[0] : null;
    } catch (err) {
      console.error('Error getting recommended strategy:', err);
      return null;
    }
  }, [strategies]);

  /**
   * Update refresh intervals for different data types
   * @param {Object} intervals - New intervals in milliseconds
   */
  const updateRefreshIntervals = useCallback((intervals) => {
    setRefreshIntervals(prev => ({
      ...prev,
      ...intervals
    }));
  }, []);

  // Set up automatic refresh intervals when component mounts
  useEffect(() => {
    // Initial data fetch
    fetchAllData();
    
    // Set up interval for staking rates
    const stakingInterval = setInterval(() => {
      refreshStakingRates().catch(err => console.error('Auto-refresh staking error:', err));
    }, refreshIntervals.stakingRates);
    
    // Set up interval for token prices
    const tokensInterval = setInterval(() => {
      refreshTokenPrices().catch(err => console.error('Auto-refresh tokens error:', err));
    }, refreshIntervals.tokenPrices);
    
    // Set up interval for news
    const newsInterval = setInterval(() => {
      refreshNews().catch(err => console.error('Auto-refresh news error:', err));
    }, refreshIntervals.news);
    
    // Clear intervals on unmount
    return () => {
      clearInterval(stakingInterval);
      clearInterval(tokensInterval);
      clearInterval(newsInterval);
    };
  }, [fetchAllData, refreshStakingRates, refreshTokenPrices, refreshNews, refreshIntervals]);

  return {
    // Data states
    stakingRates,
    tokenPrices,
    news,
    protocols,
    strategies,
    
    // Status indicators
    loading,
    error,
    lastUpdated,
    
    // Methods
    fetchAllData,
    refreshStakingRates,
    refreshTokenPrices,
    refreshNews,
    getTokenPrice,
    compareProtocolRates,
    getRecommendedStrategy,
    updateRefreshIntervals
  };
};

export default useMarketData;