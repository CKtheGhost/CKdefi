import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../services/api';

// Create data context
const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Market data state
  const [marketData, setMarketData] = useState(null);
  const [tokenData, setTokenData] = useState(null);
  const [protocolData, setProtocolData] = useState(null);
  const [newsData, setNewsData] = useState(null);
  const [isLoadingMarket, setIsLoadingMarket] = useState(false);
  const [marketError, setMarketError] = useState(null);
  
  // Staking data state
  const [stakingData, setStakingData] = useState(null);
  const [isLoadingStaking, setIsLoadingStaking] = useState(false);
  const [stakingError, setStakingError] = useState(null);
  
  // Fetch market overview data
  const fetchMarketOverview = useCallback(async () => {
    setIsLoadingMarket(true);
    setMarketError(null);
    
    try {
      const response = await api.get('/api/market/overview');
      setMarketData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching market overview:', error);
      setMarketError('Failed to load market data');
      return null;
    } finally {
      setIsLoadingMarket(false);
    }
  }, []);

  // Fetch token data
  const fetchTokenData = useCallback(async () => {
    setIsLoadingMarket(true);
    
    try {
      const response = await api.get('/api/tokens/latest');
      setTokenData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching token data:', error);
      return null;
    } finally {
      setIsLoadingMarket(false);
    }
  }, []);

  // Fetch protocol data
  const fetchProtocolData = useCallback(async () => {
    setIsLoadingStaking(true);
    setStakingError(null);
    
    try {
      const response = await api.get('/api/staking/rates');
      setProtocolData(response.data.protocols);
      setStakingData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching protocol data:', error);
      setStakingError('Failed to load protocol data');
      return null;
    } finally {
      setIsLoadingStaking(false);
    }
  }, []);

  // Fetch news data
  const fetchNewsData = useCallback(async () => {
    try {
      const response = await api.get('/api/news/latest');
      setNewsData(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching news data:', error);
      return null;
    }
  }, []);

  // Compare protocols by APR
  const compareProtocols = useCallback((protocolNames = []) => {
    if (!protocolData) return null;
    
    const filteredProtocols = {};
    
    if (protocolNames.length > 0) {
      // Filter protocols by name
      protocolNames.forEach(name => {
        if (protocolData[name.toLowerCase()]) {
          filteredProtocols[name.toLowerCase()] = protocolData[name.toLowerCase()];
        }
      });
    } else {
      // Use all protocols
      Object.assign(filteredProtocols, protocolData);
    }
    
    // Create comparison data
    const comparison = Object.entries(filteredProtocols).map(([name, data]) => {
      // Extract APR data
      const stakingApr = data.staking?.apr || 0;
      const lendingApr = data.lending?.apr || 0;
      const liquidityApr = data.liquidity?.apr || 0;
      
      // Calculate maximum APR
      const maxApr = Math.max(stakingApr, lendingApr, liquidityApr);
      
      // Determine best product
      let bestProduct = '';
      if (maxApr === stakingApr && stakingApr > 0) bestProduct = 'Staking';
      else if (maxApr === lendingApr && lendingApr > 0) bestProduct = 'Lending';
      else if (maxApr === liquidityApr && liquidityApr > 0) bestProduct = 'Liquidity';
      
      return {
        name,
        stakingApr,
        lendingApr,
        liquidityApr,
        maxApr,
        bestProduct,
        riskLevel: data.riskLevel || 'medium'
      };
    });
    
    // Sort by maximum APR
    const sortedComparison = comparison.sort((a, b) => b.maxApr - a.maxApr);
    
    return sortedComparison;
  }, [protocolData]);

  // Get protocol details
  const getProtocolDetails = useCallback((protocolName) => {
    if (!protocolData || !protocolName) return null;
    
    const protocol = protocolData[protocolName.toLowerCase()];
    
    if (!protocol) return null;
    
    return {
      name: protocolName,
      ...protocol
    };
  }, [protocolData]);

  // Get trending tokens
  const getTrendingTokens = useCallback((limit = 5) => {
    if (!tokenData || !tokenData.coins) return [];
    
    // Sort by 24h change (absolute value to include both gainers and losers)
    const sorted = [...tokenData.coins].sort((a, b) => 
      Math.abs(b.change24h) - Math.abs(a.change24h)
    );
    
    return sorted.slice(0, limit);
  }, [tokenData]);

  // Get top gainers
  const getTopGainers = useCallback((limit = 5) => {
    if (!tokenData || !tokenData.coins) return [];
    
    // Sort by 24h change (positive first)
    const sorted = [...tokenData.coins]
      .filter(token => token.change24h > 0)
      .sort((a, b) => b.change24h - a.change24h);
    
    return sorted.slice(0, limit);
  }, [tokenData]);

  // Get top losers
  const getTopLosers = useCallback((limit = 5) => {
    if (!tokenData || !tokenData.coins) return [];
    
    // Sort by 24h change (negative first)
    const sorted = [...tokenData.coins]
      .filter(token => token.change24h < 0)
      .sort((a, b) => a.change24h - b.change24h);
    
    return sorted.slice(0, limit);
  }, [tokenData]);

  // Get protocol strategies for a specific risk profile
  const getProtocolStrategies = useCallback((riskProfile = 'balanced') => {
    if (!stakingData || !stakingData.strategies) return null;
    
    return stakingData.strategies[riskProfile.toLowerCase()] || null;
  }, [stakingData]);

  // Get recommended protocol based on risk profile
  const getRecommendedProtocol = useCallback((riskProfile = 'balanced') => {
    if (!stakingData || !stakingData.strategies) return null;
    
    const strategy = stakingData.strategies[riskProfile.toLowerCase()];
    
    if (!strategy || !strategy.allocation || strategy.allocation.length === 0) {
      return stakingData.recommendedProtocol || null;
    }
    
    // Return the protocol with the highest allocation percentage
    const topAllocation = [...strategy.allocation].sort((a, b) => b.percentage - a.percentage)[0];
    
    return topAllocation.protocol;
  }, [stakingData]);

  // Load initial data
  useEffect(() => {
    // Fetch all data on initial load
    const loadInitialData = async () => {
      await Promise.all([
        fetchMarketOverview(),
        fetchTokenData(),
        fetchProtocolData(),
        fetchNewsData()
      ]);
    };
    
    loadInitialData();
    
    // Set up refresh intervals
    const marketInterval = setInterval(() => {
      fetchMarketOverview();
      fetchTokenData();
    }, 60000); // Every 1 minute
    
    const protocolInterval = setInterval(() => {
      fetchProtocolData();
    }, 300000); // Every 5 minutes
    
    const newsInterval = setInterval(() => {
      fetchNewsData();
    }, 600000); // Every 10 minutes
    
    return () => {
      clearInterval(marketInterval);
      clearInterval(protocolInterval);
      clearInterval(newsInterval);
    };
  }, [fetchMarketOverview, fetchTokenData, fetchProtocolData, fetchNewsData]);

  // Context value
  const value = {
    // Market data
    marketData,
    tokenData,
    protocolData,
    stakingData,
    newsData,
    isLoadingMarket,
    marketError,
    isLoadingStaking,
    stakingError,
    
    // Data fetch functions
    fetchMarketOverview,
    fetchTokenData,
    fetchProtocolData,
    fetchNewsData,
    
    // Data utility functions
    compareProtocols,
    getProtocolDetails,
    getTrendingTokens,
    getTopGainers,
    getTopLosers,
    getProtocolStrategies,
    getRecommendedProtocol
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;