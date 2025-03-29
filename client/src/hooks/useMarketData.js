// src/hooks/useMarketData.js
import { useState, useEffect, useContext, useCallback } from 'react';
import { DataContext } from '../context/DataContext';
import api from '../utils/api';

/**
 * Hook for fetching and managing market data
 * Provides DeFi protocol data, token prices, and market insights
 */
const useMarketData = () => {
  const { marketData, setMarketData } = useContext(DataContext);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(60000); // 1 minute default

  /**
   * Fetch latest market overview data
   */
  const fetchMarketOverview = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/tokens/latest');
      
      if (response.data) {
        setMarketData(prevData => ({
          ...prevData,
          tokens: response.data.coins || [],
          trending: response.data.trending || [],
          marketInfo: response.data.marketInfo || {},
          lastUpdated: response.data.lastUpdated || new Date().toISOString()
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching market overview:', err);
      setError('Failed to load market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [setMarketData]);

  /**
   * Fetch protocol APRs and staking data
   */
  const fetchProtocolData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/staking/rates');
      
      if (response.data) {
        setMarketData(prevData => ({
          ...prevData,
          protocols: response.data.protocols || {},
          strategies: response.data.strategies || {},
          recommendedProtocol: response.data.recommendedProtocol || null,
          lastUpdated: response.data.lastUpdated || new Date().toISOString()
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching protocol data:', err);
      setError('Failed to load protocol data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [setMarketData]);

  /**
   * Fetch latest news
   */
  const fetchLatestNews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/news/latest');
      
      if (response.data) {
        setMarketData(prevData => ({
          ...prevData,
          news: response.data.articles || [],
          featuredNews: response.data.featuredArticle || null,
          newsCategories: response.data.categories || {},
          lastUpdated: response.data.lastUpdated || new Date().toISOString()
        }));
      }
      
      setError(null);
    } catch (err) {
      console.error('Error fetching latest news:', err);
      setError('Failed to load news data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [setMarketData]);

  /**
   * Get APT price
   * @returns {number} Current APT price
   */
  const getAptPrice = useCallback(() => {
    if (!marketData || !marketData.tokens) {
      return 0;
    }
    
    const aptToken = marketData.tokens.find(token => 
      token.symbol === 'APT' || token.id === 'aptos'
    );
    
    return aptToken ? aptToken.price : 0;
  }, [marketData]);

  /**
   * Get top protocols by APR
   * @param {number} count - Number of protocols to return
   * @returns {Array} Top protocols
   */
  const getTopProtocols = useCallback((count = 5) => {
    if (!marketData || !marketData.protocols) {
      return [];
    }
    
    // Flatten protocol data with protocol names
    const allProtocols = [];
    
    Object.entries(marketData.protocols).forEach(([name, protocol]) => {
      if (protocol.staking && protocol.staking.apr) {
        allProtocols.push({
          name,
          type: 'staking',
          apr: parseFloat(protocol.staking.apr),
          product: protocol.staking.product || 'Staking'
        });
      }
      
      if (protocol.lending && protocol.lending.apr) {
        allProtocols.push({
          name,
          type: 'lending',
          apr: parseFloat(protocol.lending.apr),
          product: protocol.lending.product || 'Lending'
        });
      }
      
      if (protocol.liquidity && protocol.liquidity.apr) {
        allProtocols.push({
          name,
          type: 'liquidity',
          apr: parseFloat(protocol.liquidity.apr),
          product: protocol.liquidity.product || 'Liquidity'
        });
      }
    });
    
    // Sort by APR (descending) and return top N
    return allProtocols
      .sort((a, b) => b.apr - a.apr)
      .slice(0, count);
  }, [marketData]);

  /**
   * Get trending tokens
   * @param {number} count - Number of tokens to return
   * @returns {Array} Trending tokens
   */
  const getTrendingTokens = useCallback((count = 5) => {
    if (!marketData || !marketData.tokens) {
      return [];
    }
    
    // If trending IDs are provided, use them to filter tokens
    if (marketData.trending && marketData.trending.length > 0) {
      const trendingTokens = [];
      
      marketData.trending.forEach(id => {
        const token = marketData.tokens.find(t => t.id === id || t.symbol === id);
        if (token) {
          trendingTokens.push(token);
        }
      });
      
      return trendingTokens.slice(0, count);
    }
    
    // Otherwise, sort by price change and return top N
    return [...marketData.tokens]
      .sort((a, b) => Math.abs(b.change24h) - Math.abs(a.change24h))
      .slice(0, count);
  }, [marketData]);

  /**
   * Get market sentiment
   * @returns {string} Market sentiment (Bullish/Bearish/Neutral)
   */
  const getMarketSentiment = useCallback(() => {
    if (!marketData || !marketData.marketInfo) {
      return 'Neutral';
    }
    
    return marketData.marketInfo.sentiment || 'Neutral';
  }, [marketData]);

  /**
   * Get latest news articles
   * @param {number} count - Number of articles to return
   * @returns {Array} News articles
   */
  const getLatestNews = useCallback((count = 3) => {
    if (!marketData || !marketData.news) {
      return [];
    }
    
    return marketData.news.slice(0, count);
  }, [marketData]);

  /**
   * Fetch all market data
   */
  const fetchAllMarketData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      await Promise.all([
        fetchMarketOverview(),
        fetchProtocolData(),
        fetchLatestNews()
      ]);
      
      setError(null);
    } catch (err) {
      console.error('Error fetching all market data:', err);
      setError('Failed to load market data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [fetchMarketOverview, fetchProtocolData, fetchLatestNews]);

  /**
   * Set refresh interval for market data
   * @param {number} intervalMs - Interval in milliseconds
   */
  const setRefreshRate = useCallback((intervalMs) => {
    setRefreshInterval(intervalMs);
  }, []);

  // Fetch market data on mount
  useEffect(() => {
    fetchAllMarketData();
    
    // Set up interval for refreshing data
    const intervalId = setInterval(() => {
      fetchAllMarketData();
    }, refreshInterval);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [fetchAllMarketData, refreshInterval]);

  return {
    marketData,
    loading,
    error,
    fetchMarketOverview,
    fetchProtocolData,
    fetchLatestNews,
    fetchAllMarketData,
    getAptPrice,
    getTopProtocols,
    getTrendingTokens,
    getMarketSentiment,
    getLatestNews,
    setRefreshRate
  };
};

export default useMarketData;