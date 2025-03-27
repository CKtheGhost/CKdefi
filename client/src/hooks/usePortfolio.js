// usePortfolio.js - Hook for fetching and managing wallet portfolio data
import { useState, useEffect, useCallback, useContext } from 'react';
import { useWallet } from './useWallet';
import { NotificationContext } from '../context/NotificationContext';
import api from '../services/api';

/**
 * Hook for fetching and managing portfolio data from a wallet
 */
const usePortfolio = (walletAddressParam) => {
  const { isConnected, walletAddress: connectedWalletAddress } = useWallet();
  const { showNotification } = useContext(NotificationContext);
  
  // Use provided wallet address or the connected wallet address
  const walletAddress = walletAddressParam || connectedWalletAddress;
  
  // Portfolio data states
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioHistory, setPortfolioHistory] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [tokenBreakdown, setTokenBreakdown] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [aptBalance, setAptBalance] = useState(0);
  const [stakedPositions, setStakedPositions] = useState([]);
  const [liquidityPositions, setLiquidityPositions] = useState([]);
  
  // Track refresh status
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(false);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(5 * 60 * 1000); // 5 minutes default
  
  /**
   * Fetch portfolio data for a wallet
   */
  const fetchPortfolio = useCallback(async (address = walletAddress) => {
    if (!address) {
      setError('No wallet address provided');
      return null;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const response = await api.get(`/wallet/${address}`);
      const data = response.data;
      
      // Update state with new data
      setPortfolioData(data);
      setLastUpdated(new Date());
      
      // Extract key metrics from response
      if (data.portfolio) {
        const portfolio = data.portfolio;
        setTotalValue(portfolio.totalValueUSD || 0);
        setAptBalance(parseFloat(portfolio.apt?.amount || 0));
        
        // Process token breakdown
        const tokens = [];
        
        // Add APT
        if (portfolio.apt) {
          tokens.push({
            token: 'APT',
            name: 'Aptos',
            amount: parseFloat(portfolio.apt.amount),
            valueUSD: portfolio.apt.valueUSD,
            percentage: (portfolio.apt.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
            type: 'native'
          });
        }
        
        // Add staked tokens
        const stakedTokensMap = {
          'stAPT': { name: 'stAPT (Amnis)', protocol: 'Amnis' },
          'sthAPT': { name: 'sthAPT (Thala)', protocol: 'Thala' },
          'tAPT': { name: 'tAPT (Tortuga)', protocol: 'Tortuga' },
          'dAPT': { name: 'dAPT (Ditto)', protocol: 'Ditto' }
        };
        
        const stakedList = [];
        Object.entries(stakedTokensMap).forEach(([key, info]) => {
          if (portfolio[key] && parseFloat(portfolio[key].amount) > 0) {
            const token = {
              token: key,
              name: info.name,
              protocol: info.protocol,
              amount: parseFloat(portfolio[key].amount),
              valueUSD: portfolio[key].valueUSD,
              percentage: (portfolio[key].valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
              type: 'staked',
              apr: portfolio[key].apr || null
            };
            
            tokens.push(token);
            stakedList.push(token);
          }
        });
        setStakedPositions(stakedList);
        
        // Add liquidity positions
        const liquidityList = [];
        if (portfolio.ammLiquidity && portfolio.ammLiquidity.hasLiquidity) {
          if (portfolio.ammLiquidity.positions && portfolio.ammLiquidity.positions.length > 0) {
            portfolio.ammLiquidity.positions.forEach(position => {
              if (position.valueUSD > 0) {
                const liquidityToken = {
                  token: position.pairName || 'LP Token',
                  name: position.pairName || 'Liquidity Pool Token',
                  protocol: position.protocol || 'AMM',
                  valueUSD: position.valueUSD,
                  percentage: (position.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
                  type: 'liquidity',
                  apr: position.apr || null
                };
                
                tokens.push(liquidityToken);
                liquidityList.push(liquidityToken);
              }
            });
          } else if (portfolio.ammLiquidity.valueUSD > 0) {
            const liquidityToken = {
              token: 'LP',
              name: 'Liquidity Pool Token',
              protocol: 'AMM',
              valueUSD: portfolio.ammLiquidity.valueUSD,
              percentage: (portfolio.ammLiquidity.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
              type: 'liquidity'
            };
            
            tokens.push(liquidityToken);
            liquidityList.push(liquidityToken);
          }
        }
        setLiquidityPositions(liquidityList);
        
        // Add any other tokens
        if (portfolio.otherTokens && portfolio.otherTokens.length > 0) {
          portfolio.otherTokens.forEach(token => {
            if (token.valueUSD > 0) {
              tokens.push({
                token: token.symbol || 'Unknown',
                name: token.name || token.symbol || 'Unknown Token',
                amount: parseFloat(token.amount || 0),
                valueUSD: token.valueUSD,
                percentage: (token.valueUSD / portfolio.totalValueUSD * 100).toFixed(2),
                type: 'other'
              });
            }
          });
        }
        
        setTokenBreakdown(tokens);
      }
      
      // Extract historical data if available
      if (data.portfolioHistory) {
        setPortfolioHistory(data.portfolioHistory);
      }
      
      return data;
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.response?.data?.message || 'Failed to fetch portfolio data');
      
      showNotification({
        type: 'error',
        title: 'Portfolio Error',
        message: 'Failed to fetch portfolio data'
      });
      
      return null;
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [walletAddress, showNotification]);
  
  /**
   * Refresh portfolio data
   */
  const refreshPortfolio = useCallback(() => {
    setIsRefreshing(true);
    return fetchPortfolio(walletAddress);
  }, [fetchPortfolio, walletAddress]);
  
  /**
   * Toggle auto-refresh functionality
   */
  const toggleAutoRefresh = useCallback(() => {
    setAutoRefreshEnabled(prev => !prev);
  }, []);
  
  /**
   * Set auto-refresh interval
   */
  const setRefreshInterval = useCallback((interval) => {
    if (interval && interval > 0) {
      setAutoRefreshInterval(interval);
    }
  }, []);
  
  /**
   * Calculate performance metrics
   */
  const calculatePerformanceMetrics = useCallback(() => {
    if (!portfolioHistory || portfolioHistory.length < 2) {
      return {
        dailyChange: 0,
        weeklyChange: 0,
        monthlyChange: 0,
        dailyPercentage: 0,
        weeklyPercentage: 0,
        monthlyPercentage: 0
      };
    }
    
    // Sort history by date
    const sortedHistory = [...portfolioHistory].sort((a, b) => 
      new Date(a.date) - new Date(b.date)
    );
    
    const currentValue = sortedHistory[sortedHistory.length - 1].value;
    
    // Get historical values
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    
    // Find closest data points
    const findClosestValue = (targetDate) => {
      return sortedHistory.reduce((closest, current) => {
        const currentDate = new Date(current.date);
        const closestDate = new Date(closest.date);
        
        return Math.abs(currentDate - targetDate) < Math.abs(closestDate - targetDate) 
          ? current 
          : closest;
      });
    };
    
    const dayValue = findClosestValue(oneDayAgo).value;
    const weekValue = findClosestValue(oneWeekAgo).value;
    const monthValue = findClosestValue(oneMonthAgo).value;
    
    // Calculate changes
    const dailyChange = currentValue - dayValue;
    const weeklyChange = currentValue - weekValue;
    const monthlyChange = currentValue - monthValue;
    
    // Calculate percentages
    const dailyPercentage = dayValue !== 0 ? (dailyChange / dayValue) * 100 : 0;
    const weeklyPercentage = weekValue !== 0 ? (weeklyChange / weekValue) * 100 : 0;
    const monthlyPercentage = monthValue !== 0 ? (monthlyChange / monthValue) * 100 : 0;
    
    return {
      dailyChange,
      weeklyChange,
      monthlyChange,
      dailyPercentage,
      weeklyPercentage,
      monthlyPercentage
    };
  }, [portfolioHistory]);
  
  // Fetch portfolio data on mount and address change
  useEffect(() => {
    if (walletAddress) {
      fetchPortfolio(walletAddress);
    }
  }, [walletAddress, fetchPortfolio]);
  
  // Set up auto-refresh interval
  useEffect(() => {
    let intervalId;
    
    if (autoRefreshEnabled && walletAddress) {
      intervalId = setInterval(() => {
        refreshPortfolio();
      }, autoRefreshInterval);
    }
    
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefreshEnabled, autoRefreshInterval, refreshPortfolio, walletAddress]);
  
  // Return portfolio data and operations
  return {
    isLoading,
    isRefreshing,
    error,
    portfolioData,
    portfolioHistory,
    lastUpdated,
    tokenBreakdown,
    totalValue,
    aptBalance,
    stakedPositions,
    liquidityPositions,
    fetchPortfolio,
    refreshPortfolio,
    autoRefreshEnabled,
    autoRefreshInterval,
    toggleAutoRefresh,
    setRefreshInterval,
    performanceMetrics: calculatePerformanceMetrics(),
    hasData: !!portfolioData
  };
};

export default usePortfolio;