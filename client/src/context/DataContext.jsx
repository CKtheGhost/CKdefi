import React, { createContext, useState, useEffect, useCallback } from 'react';

// Create the context
export const DataContext = createContext(null);

export const DataProvider = ({ children }) => {
  // Market data
  const [tokenData, setTokenData] = useState(null);
  const [tokenLoading, setTokenLoading] = useState(false);
  const [tokenError, setTokenError] = useState(null);
  
  // News data
  const [newsData, setNewsData] = useState(null);
  const [newsLoading, setNewsLoading] = useState(false);
  const [newsError, setNewsError] = useState(null);
  
  // Staking data
  const [stakingData, setStakingData] = useState(null);
  const [stakingLoading, setStakingLoading] = useState(false);
  const [stakingError, setStakingError] = useState(null);
  
  // Refresh intervals in milliseconds
  const MARKET_REFRESH_INTERVAL = 60000; // 1 minute
  const NEWS_REFRESH_INTERVAL = 300000; // 5 minutes
  const STAKING_REFRESH_INTERVAL = 600000; // 10 minutes

  // Fetch token market data
  const fetchTokenData = useCallback(async () => {
    try {
      setTokenLoading(true);
      setTokenError(null);
      
      const response = await fetch('/api/tokens/latest');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch token data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setTokenData(data);
    } catch (error) {
      console.error('Error fetching token data:', error);
      setTokenError(error.message || 'Failed to load token data');
    } finally {
      setTokenLoading(false);
    }
  }, []);

  // Fetch news data
  const fetchNewsData = useCallback(async () => {
    try {
      setNewsLoading(true);
      setNewsError(null);
      
      const response = await fetch('/api/news/latest');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch news data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setNewsData(data);
    } catch (error) {
      console.error('Error fetching news data:', error);
      setNewsError(error.message || 'Failed to load news data');
    } finally {
      setNewsLoading(false);
    }
  }, []);

  // Fetch staking data
  const fetchStakingData = useCallback(async () => {
    try {
      setStakingLoading(true);
      setStakingError(null);
      
      const response = await fetch('/api/staking/latest');
      
      if (!response.ok) {
        throw new Error(`Failed to fetch staking data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setStakingData(data);
    } catch (error) {
      console.error('Error fetching staking data:', error);
      setStakingError(error.message || 'Failed to load staking data');
    } finally {
      setStakingLoading(false);
    }
  }, []);

  // Fetch all data at once
  const fetchAllData = useCallback(() => {
    fetchTokenData();
    fetchNewsData();
    fetchStakingData();
  }, [fetchTokenData, fetchNewsData, fetchStakingData]);

  // Setup periodic data fetching
  useEffect(() => {
    // Initial data fetch
    fetchAllData();
    
    // Setup intervals
    const tokenInterval = setInterval(fetchTokenData, MARKET_REFRESH_INTERVAL);
    const newsInterval = setInterval(fetchNewsData, NEWS_REFRESH_INTERVAL);
    const stakingInterval = setInterval(fetchStakingData, STAKING_REFRESH_INTERVAL);
    
    // Cleanup intervals
    return () => {
      clearInterval(tokenInterval);
      clearInterval(newsInterval);
      clearInterval(stakingInterval);
    };
  }, [fetchAllData, fetchTokenData, fetchNewsData, fetchStakingData]);

  // Format APR data for comparison chart
  const getFormattedAPRData = useCallback(() => {
    if (!stakingData || !stakingData.protocols) {
      return [];
    }
    
    return Object.entries(stakingData.protocols).map(([name, protocol]) => {
      let stakingAPR = 0;
      let lendingAPR = 0;
      let ammAPR = 0;
      
      if (protocol.staking && protocol.staking.apr) {
        stakingAPR = protocol.staking.apr;
      }
      
      if (protocol.lending && protocol.lending.apr) {
        lendingAPR = protocol.lending.apr;
      }
      
      if (protocol.amm && protocol.amm.apr) {
        ammAPR = protocol.amm.apr;
      }
      
      return {
        name,
        staking: stakingAPR,
        lending: lendingAPR,
        amm: ammAPR,
        blended: protocol.blendedStrategy ? protocol.blendedStrategy.apr : 0
      };
    });
  }, [stakingData]);

  // Get recommended strategies based on risk profile
  const getRecommendedStrategies = useCallback((riskProfile = 'balanced') => {
    if (!stakingData || !stakingData.strategies) {
      return null;
    }
    
    return stakingData.strategies[riskProfile] || stakingData.strategies.balanced;
  }, [stakingData]);

  // Provider value
  const value = {
    // Token data
    tokenData,
    tokenLoading,
    tokenError,
    fetchTokenData,
    
    // News data
    newsData,
    newsLoading,
    newsError,
    fetchNewsData,
    
    // Staking data
    stakingData,
    stakingLoading,
    stakingError,
    fetchStakingData,
    
    // Helper functions
    fetchAllData,
    getFormattedAPRData,
    getRecommendedStrategies
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = React.useContext(DataContext);
  if (context === null) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};