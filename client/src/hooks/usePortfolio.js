import { useState, useEffect, useCallback, useContext } from 'react';
import api from '../services/api';
import { useWallet } from './useWallet';
import { UserContext } from '../context/UserContext';

export const usePortfolio = () => {
  const { wallet, connected } = useWallet();
  const { user } = useContext(UserContext);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [stakedPositions, setStakedPositions] = useState([]);
  const [liquidityPositions, setLiquidityPositions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [riskAnalysis, setRiskAnalysis] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  // Fetch portfolio data when wallet changes
  useEffect(() => {
    if (connected && wallet?.address) {
      fetchPortfolioData(wallet.address);
    } else {
      // Clear data when wallet disconnects
      resetPortfolioData();
    }
  }, [connected, wallet?.address]);

  // Reset all portfolio data
  const resetPortfolioData = () => {
    setPortfolioData(null);
    setHistoricalData([]);
    setStakedPositions([]);
    setLiquidityPositions([]);
    setTransactionHistory([]);
    setRiskAnalysis(null);
    setLastUpdated(null);
  };

  // Fetch complete portfolio analysis
  const fetchPortfolioData = useCallback(async (address) => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/wallet/${address}`);
      
      if (response.data) {
        setPortfolioData(response.data.portfolio);
        
        // Extract staked and liquidity positions
        if (response.data.portfolio) {
          // Extract staked positions
          const staked = [];
          if (response.data.portfolio.stAPT && parseFloat(response.data.portfolio.stAPT.amount) > 0) {
            staked.push({
              protocol: 'amnis',
              token: 'stAPT',
              amount: response.data.portfolio.stAPT.amount,
              valueUSD: response.data.portfolio.stAPT.valueUSD
            });
          }
          
          if (response.data.portfolio.sthAPT && parseFloat(response.data.portfolio.sthAPT.amount) > 0) {
            staked.push({
              protocol: 'thala',
              token: 'sthAPT',
              amount: response.data.portfolio.sthAPT.amount,
              valueUSD: response.data.portfolio.sthAPT.valueUSD
            });
          }
          
          if (response.data.portfolio.tAPT && parseFloat(response.data.portfolio.tAPT.amount) > 0) {
            staked.push({
              protocol: 'tortuga',
              token: 'tAPT',
              amount: response.data.portfolio.tAPT.amount,
              valueUSD: response.data.portfolio.tAPT.valueUSD
            });
          }
          
          if (response.data.portfolio.dAPT && parseFloat(response.data.portfolio.dAPT.amount) > 0) {
            staked.push({
              protocol: 'ditto',
              token: 'dAPT',
              amount: response.data.portfolio.dAPT.amount,
              valueUSD: response.data.portfolio.dAPT.valueUSD
            });
          }
          
          setStakedPositions(staked);
          
          // Extract liquidity positions
          if (response.data.portfolio.ammLiquidity && response.data.portfolio.ammLiquidity.hasLiquidity) {
            setLiquidityPositions(response.data.portfolio.ammLiquidity.positions || []);
          } else {
            setLiquidityPositions([]);
          }
        }
        
        setLastUpdated(response.data.lastUpdated || new Date().toISOString());
      }
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message || 'Failed to load portfolio data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch historical performance data
  const fetchHistoricalData = useCallback(async (address, period = '30d') => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/wallet/${address}/history?period=${period}`);
      
      if (response.data && response.data.historicalData) {
        setHistoricalData(response.data.historicalData);
      }
    } catch (err) {
      console.error('Error fetching historical data:', err);
      setError(err.message || 'Failed to load historical data');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async (address, limit = 20) => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/wallet/${address}/transactions?limit=${limit}`);
      
      if (response.data && response.data.transactions) {
        setTransactionHistory(response.data.transactions);
      }
    } catch (err) {
      console.error('Error fetching transactions:', err);
      setError(err.message || 'Failed to load transaction history');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch risk analysis
  const fetchRiskAnalysis = useCallback(async (address) => {
    if (!address) return;
    
    try {
      setLoading(true);
      const response = await api.get(`/api/wallet/${address}/risk-analysis`);
      
      if (response.data) {
        setRiskAnalysis(response.data);
      }
    } catch (err) {
      console.error('Error fetching risk analysis:', err);
      setError(err.message || 'Failed to load risk analysis');
    } finally {
      setLoading(false);
    }
  }, []);

  // Calculate portfolio allocation percentages
  const getPortfolioAllocation = useCallback(() => {
    if (!portfolioData || !portfolioData.totalValueUSD || portfolioData.totalValueUSD === 0) {
      return [];
    }
    
    const allocation = [];
    const totalValue = parseFloat(portfolioData.totalValueUSD);
    
    // Add native APT
    if (portfolioData.apt && parseFloat(portfolioData.apt.valueUSD) > 0) {
      allocation.push({
        asset: 'APT',
        protocol: 'Native',
        percentage: (parseFloat(portfolioData.apt.valueUSD) / totalValue * 100).toFixed(2),
        value: portfolioData.apt.valueUSD,
        amount: portfolioData.apt.amount
      });
    }
    
    // Add staked positions
    stakedPositions.forEach(position => {
      allocation.push({
        asset: position.token,
        protocol: position.protocol,
        percentage: (parseFloat(position.valueUSD) / totalValue * 100).toFixed(2),
        value: position.valueUSD,
        amount: position.amount
      });
    });
    
    // Add liquidity positions
    if (portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity) {
      // Group by protocol if multiple positions exist
      const liquidityByProtocol = {};
      
      if (portfolioData.ammLiquidity.positions && portfolioData.ammLiquidity.positions.length > 0) {
        portfolioData.ammLiquidity.positions.forEach(position => {
          if (!liquidityByProtocol[position.protocol]) {
            liquidityByProtocol[position.protocol] = {
              value: 0,
              positions: []
            };
          }
          
          liquidityByProtocol[position.protocol].value += parseFloat(position.valueUSD);
          liquidityByProtocol[position.protocol].positions.push(position);
        });
        
        // Add each protocol as an allocation
        Object.entries(liquidityByProtocol).forEach(([protocol, data]) => {
          allocation.push({
            asset: 'Liquidity',
            protocol,
            percentage: (data.value / totalValue * 100).toFixed(2),
            value: data.value.toFixed(2),
            positions: data.positions
          });
        });
      } else {
        // Add generic liquidity entry if no positions are detailed
        allocation.push({
          asset: 'Liquidity',
          protocol: 'AMM',
          percentage: (parseFloat(portfolioData.ammLiquidity.estimatedValueUSD) / totalValue * 100).toFixed(2),
          value: portfolioData.ammLiquidity.estimatedValueUSD
        });
      }
    }
    
    return allocation;
  }, [portfolioData, stakedPositions]);

  // Refresh all portfolio data
  const refreshPortfolio = useCallback(async () => {
    if (!connected || !wallet?.address) {
      setError('Wallet not connected');
      return false;
    }
    
    try {
      setLoading(true);
      await Promise.all([
        fetchPortfolioData(wallet.address),
        fetchHistoricalData(wallet.address),
        fetchTransactionHistory(wallet.address)
      ]);
      
      return true;
    } catch (err) {
      console.error('Error refreshing portfolio:', err);
      setError(err.message || 'Failed to refresh portfolio data');
      return false;
    } finally {
      setLoading(false);
    }
  }, [connected, wallet, fetchPortfolioData, fetchHistoricalData, fetchTransactionHistory]);

  return {
    portfolioData,
    historicalData,
    stakedPositions,
    liquidityPositions,
    transactionHistory,
    riskAnalysis,
    lastUpdated,
    loading,
    error,
    getPortfolioAllocation,
    refreshPortfolio,
    fetchPortfolioData,
    fetchHistoricalData,
    fetchTransactionHistory,
    fetchRiskAnalysis
  };
};

export default usePortfolio;