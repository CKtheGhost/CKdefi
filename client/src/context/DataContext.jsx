// Nexus-level DataContext.js
// Retains the original data fetching and storage logic, while adding
// advanced error handling, improved logging, and performance considerations.

import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';

// Create context
export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioData, setPortfolioData] = useState(null);
  const [stakingData, setStakingData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [newsData, setNewsData] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [error, setError] = useState(null);
  const [recommendationHistory, setRecommendationHistory] = useState([]);

  /**
   * Main data fetch triggered on mount and at intervals (e.g., 5 minutes).
   */
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchPortfolioData(),
        fetchStakingData(),
        fetchMarketData(),
        fetchNewsData(),
      ]);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('[DataContext] Error fetching data:', err);
      setError('Failed to load data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // On mount, initial fetch plus periodic refresh every 5 minutes
  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, [fetchData]);

  // Mocked portfolio data fetch
  const fetchPortfolioData = async (walletAddress) => {
    try {
      // Mock data
      const mockData = {
        apt: { amount: '10.5', valueUSD: 105.0 },
        stAPT: { amount: '5.2', valueUSD: 54.6 },
        tAPT: { amount: '0', valueUSD: 0 },
        totalValueUSD: 159.6,
      };
      setPortfolioData(mockData);
      return mockData;
    } catch (err) {
      console.error('[DataContext] fetchPortfolioData error:', err);
      throw err;
    }
  };

  // Mocked staking data fetch
  const fetchStakingData = async () => {
    try {
      const mockStaking = {
        protocols: {
          amnis: {
            staking: { apr: '7.2', product: 'stAPT' },
            blendedStrategy: { apr: '7.6' },
          },
          thala: {
            staking: { apr: '7.5', product: 'sthAPT' },
            blendedStrategy: { apr: '7.9' },
          },
          tortuga: {
            staking: { apr: '7.0', product: 'tAPT' },
            blendedStrategy: { apr: '7.0' },
          },
          ditto: {
            staking: { apr: '7.8', product: 'dAPT' },
            blendedStrategy: { apr: '7.8' },
          },
        },
      };
      setStakingData(mockStaking);
      return mockStaking;
    } catch (err) {
      console.error('[DataContext] fetchStakingData error:', err);
      throw err;
    }
  };

  // Mocked market data fetch
  const fetchMarketData = async () => {
    try {
      const mockMarkets = {
        tokens: [
          { symbol: 'APT', price: 10.0, change24h: 2.5 },
          { symbol: 'stAPT', price: 10.5, change24h: 2.6 },
          { symbol: 'tAPT', price: 10.3, change24h: 2.4 },
        ],
      };
      setMarketData(mockMarkets);
      return mockMarkets;
    } catch (err) {
      console.error('[DataContext] fetchMarketData error:', err);
      throw err;
    }
  };

  // Mocked news data fetch
  const fetchNewsData = async () => {
    try {
      const mockNews = [
        { id: 1, title: 'New Staking Protocol Launches on Aptos', date: '2025-03-20', url: '#' },
        { id: 2, title: 'Aptos DeFi TVL Reaches New ATH', date: '2025-03-25', url: '#' },
      ];
      setNewsData(mockNews);
      return mockNews;
    } catch (err) {
      console.error('[DataContext] fetchNewsData error:', err);
      throw err;
    }
  };

  /**
   * Load previously stored recommendation history (mock).
   */
  const loadRecommendationHistory = async () => {
    try {
      // Mock data
      const history = [
        {
          title: 'Balanced Yield Strategy',
          timestamp: new Date(Date.now() - 86400000).toISOString(),
          totalApr: '7.8',
          allocation: [
            { protocol: 'Amnis', product: 'Liquid Staking', percentage: 40 },
            { protocol: 'Thala', product: 'Liquid Staking', percentage: 30 },
            { protocol: 'PancakeSwap', product: 'AMM Liquidity', percentage: 20 },
            { protocol: 'Ditto', product: 'Liquid Staking', percentage: 10 },
          ],
        },
        {
          title: 'Conservative Staking',
          timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
          totalApr: '7.3',
          allocation: [
            { protocol: 'Amnis', product: 'Liquid Staking', percentage: 50 },
            { protocol: 'Thala', product: 'Liquid Staking', percentage: 50 },
          ],
        },
      ];
      setRecommendationHistory(history);
      return history;
    } catch (err) {
      console.error('[DataContext] loadRecommendationHistory error:', err);
      return [];
    }
  };

  /**
   * Save a new recommendation in memory (and possibly localStorage).
   */
  const saveRecommendation = (recommendation) => {
    if (!recommendation) return;
    const recWithTime = {
      ...recommendation,
      timestamp: recommendation.timestamp || new Date().toISOString(),
    };
    setRecommendationHistory((prev) => [recWithTime, ...prev]);
    return recWithTime;
  };

  const value = {
    isLoading,
    portfolioData,
    stakingData,
    marketData,
    newsData,
    lastUpdated,
    error,
    recommendationHistory,

    // Methods
    refreshData: fetchData,
    fetchPortfolioData,
    loadRecommendationHistory,
    saveRecommendation,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

// Custom hook
export const useData = () => {
  const ctx = useContext(DataContext);
  if (!ctx) {
    throw new Error('[useData] must be used within a DataProvider.');
  }
  return ctx;
};

export default DataContext;
