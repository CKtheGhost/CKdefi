import React, { createContext, useState, useContext, useEffect } from 'react';

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

  // Initial data fetch
  useEffect(() => {
    fetchData();
    
    // Refresh data periodically (every 5 minutes)
    const intervalId = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  // Main data fetching function
  const fetchData = async () => {
    setIsLoading(true);
    
    try {
      // Mock data for demonstration
      await Promise.all([
        fetchPortfolioData(),
        fetchStakingData(),
        fetchMarketData(),
        fetchNewsData()
      ]);
      
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch portfolio data
  const fetchPortfolioData = async (walletAddress) => {
    // Mock implementation - in real app would fetch from API
    const mockData = {
      apt: { amount: "10.5", valueUSD: 105.0 },
      stAPT: { amount: "5.2", valueUSD: 54.6 },
      tAPT: { amount: "0", valueUSD: 0 },
      totalValueUSD: 159.6
    };
    
    setPortfolioData(mockData);
    return mockData;
  };

  // Fetch staking data
  const fetchStakingData = async () => {
    // Mock implementation
    const mockData = {
      protocols: {
        amnis: { 
          staking: { apr: "7.2", product: "stAPT" },
          blendedStrategy: { apr: "7.6" }
        },
        thala: { 
          staking: { apr: "7.5", product: "sthAPT" },
          blendedStrategy: { apr: "7.9" }
        },
        tortuga: { 
          staking: { apr: "7.0", product: "tAPT" },
          blendedStrategy: { apr: "7.0" }
        },
        ditto: { 
          staking: { apr: "7.8", product: "dAPT" },
          blendedStrategy: { apr: "7.8" }
        }
      }
    };
    
    setStakingData(mockData);
    return mockData;
  };

  // Fetch market data
  const fetchMarketData = async () => {
    // Mock implementation
    const mockData = {
      tokens: [
        { symbol: "APT", price: 10.0, change24h: 2.5 },
        { symbol: "stAPT", price: 10.5, change24h: 2.6 },
        { symbol: "tAPT", price: 10.3, change24h: 2.4 }
      ]
    };
    
    setMarketData(mockData);
    return mockData;
  };

  // Fetch news data
  const fetchNewsData = async () => {
    // Mock implementation
    const mockData = [
      { id: 1, title: "New Staking Protocol Launches on Aptos", date: "2025-03-20", url: "#" },
      { id: 2, title: "Aptos DeFi TVL Reaches New ATH", date: "2025-03-25", url: "#" }
    ];
    
    setNewsData(mockData);
    return mockData;
  };

  // Load recommendation history
  const loadRecommendationHistory = async () => {
    // Mock implementation
    const history = [
      {
        title: "Balanced Yield Strategy",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        totalApr: "7.8",
        allocation: [
          { protocol: "Amnis", product: "Liquid Staking", percentage: 40 },
          { protocol: "Thala", product: "Liquid Staking", percentage: 30 },
          { protocol: "PancakeSwap", product: "AMM Liquidity", percentage: 20 },
          { protocol: "Ditto", product: "Liquid Staking", percentage: 10 }
        ]
      },
      {
        title: "Conservative Staking",
        timestamp: new Date(Date.now() - 7 * 86400000).toISOString(),
        totalApr: "7.3",
        allocation: [
          { protocol: "Amnis", product: "Liquid Staking", percentage: 50 },
          { protocol: "Thala", product: "Liquid Staking", percentage: 50 }
        ]
      }
    ];
    
    setRecommendationHistory(history);
    return history;
  };

  // Save a recommendation to history
  const saveRecommendation = (recommendation) => {
    if (!recommendation) return;
    
    const updatedRecommendation = {
      ...recommendation,
      timestamp: new Date().toISOString()
    };
    
    setRecommendationHistory(prev => [updatedRecommendation, ...prev]);
    return updatedRecommendation;
  };

  // Context value
  const value = {
    isLoading,
    portfolioData,
    stakingData,
    marketData,
    newsData,
    lastUpdated,
    error,
    recommendationHistory,
    refreshData: fetchData,
    fetchPortfolioData,
    loadRecommendationHistory,
    saveRecommendation
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook for using the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;