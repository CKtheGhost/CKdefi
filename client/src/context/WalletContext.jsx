// src/context/WalletContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { useNotification } from './NotificationContext';
import { executeTransaction, CONTRACT_ADDRESSES } from '../services/transactionService';

// Create context
const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // Wallet state
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [provider, setProvider] = useState(null);
  const [shortenedAddress, setShortenedAddress] = useState('');
  const [balance, setBalance] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [error, setError] = useState(null);
  const [walletType, setWalletType] = useState(null);
  const [network, setNetwork] = useState(null);
  
  // Get wallet adapter
  const {
    connect,
    account,
    connected,
    disconnect,
    wallet,
    wallets,
    signAndSubmitTransaction
  } = useWallet();
  
  // Get notification context
  const { showNotification } = useNotification();
  
  // Connect wallet
  const connectWallet = async (preferredProvider = null) => {
    try {
      setError(null);
      
      if (preferredProvider) {
        // Connect to preferred provider
        const walletToConnect = wallets.find(w => w.name.toLowerCase() === preferredProvider.toLowerCase());
        if (walletToConnect) {
          await connect(walletToConnect.name);
        } else {
          throw new Error(`Wallet provider ${preferredProvider} not found`);
        }
      } else {
        // Connect to default or first available provider
        await connect();
      }
      
      return true;
    } catch (error) {
      console.error('Wallet connection error:', error);
      setError(error.message || 'Failed to connect wallet');
      throw error;
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    try {
      await disconnect();
      setIsConnected(false);
      setAddress('');
      setShortenedAddress('');
      setBalance(null);
      setPortfolioData(null);
      setProvider(null);
      
      // Clear local wallet data
      localStorage.removeItem('connectedWallet');
      
      return true;
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      setError(error.message || 'Failed to disconnect wallet');
      return false;
    }
  };
  
  // Execute transaction
  const executeWalletTransaction = async (transaction) => {
    try {
      if (!isConnected) {
        throw new Error('Wallet not connected');
      }
      
      // Execute transaction using the transaction service
      const result = await executeTransaction(transaction, {
        generateTransaction: async (payload) => {
          // In a real implementation, this would create the transaction
          return payload;
        },
        signTransaction: async (tx) => {
          // In a real implementation, this would sign the transaction
          return tx;
        },
        submitTransaction: async (signedTx) => {
          // In a real implementation, this would interact with the wallet adapter
          return await signAndSubmitTransaction({
            ...signedTx,
            type: "entry_function_payload"
          });
        },
        getTransaction: async (hash) => {
          // In a real implementation, this would check transaction status
          // This is a simplified mock
          return { success: true, hash };
        }
      });
      
      return result;
    } catch (error) {
      console.error('Transaction execution error:', error);
      setError(error.message || 'Failed to execute transaction');
      throw error;
    }
  };
  
  // Refresh portfolio data
  const refreshPortfolio = async () => {
    if (!isConnected || !address) {
      return;
    }
    
    try {
      setPortfolioLoading(true);
      setError(null);
      
      // In a real implementation, this would fetch portfolio data from the API
      // For now, we'll simulate a delay and return mock data
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock portfolio data
      const mockPortfolioData = {
        apt: {
          amount: "100.5",
          valueUSD: 250.25,
          price: 2.49
        },
        stAPT: {
          amount: "50.2",
          valueUSD: 125.5,
          apr: 7.4
        },
        sthAPT: {
          amount: "30.1",
          valueUSD: 75.25,
          apr: 7.6
        },
        tAPT: {
          amount: "20.5",
          valueUSD: 51.25,
          apr: 7.2
        },
        dAPT: {
          amount: "10.3",
          valueUSD: 25.75,
          apr: 7.8
        },
        totalValueUSD: 527.0,
        performance: {
          dailyChange: "+1.2",
          weeklyChange: "+3.5",
          monthlyChange: "+8.2"
        },
        unrealizedGainUSD: 27.5,
        ammLiquidity: {
          hasLiquidity: true,
          estimatedValueUSD: 125.0,
          positions: [
            {
              protocol: "PancakeSwap",
              pair: "APT/USDC",
              valueUSD: 75.0,
              apr: 9.5
            },
            {
              protocol: "Cetus",
              pair: "APT/stAPT",
              valueUSD: 50.0,
              apr: 8.2
            }
          ]
        }
      };
      
      setPortfolioData(mockPortfolioData);
      
      // Update balance
      setBalance(parseFloat(mockPortfolioData.apt.amount).toFixed(4));
      
      return mockPortfolioData;
    } catch (error) {
      console.error('Portfolio refresh error:', error);
      setError(error.message || 'Failed to refresh portfolio data');
      return null;
    } finally {
      setPortfolioLoading(false);
    }
  };
  
  // Get contract addresses
  const getContractAddresses = () => {
    return CONTRACT_ADDRESSES;
  };
  
  // Update wallet state when Aptos wallet changes
  useEffect(() => {
    if (connected && account) {
      setIsConnected(true);
      setAddress(account.address);
      setShortenedAddress(`${account.address.slice(0, 6)}...${account.address.slice(-4)}`);
      setProvider(wallet?.name || 'Unknown');
      setWalletType(wallet?.name || 'Unknown');
      
      // Save connected wallet to localStorage
      localStorage.setItem('connectedWallet', account.address);
      
      // Fetch portfolio data
      refreshPortfolio();
    } else {
      setIsConnected(false);
      setAddress('');
      setShortenedAddress('');
      setBalance(null);
    }
  }, [connected, account, wallet]);
  
  // Provider value
  const value = {
    isConnected,
    address,
    shortenedAddress,
    balance,
    portfolioData,
    portfolioLoading,
    error,
    provider: walletType,
    network,
    connectWallet,
    disconnectWallet,
    executeTransaction: executeWalletTransaction,
    refreshPortfolio,
    getContractAddresses
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook for using wallet context
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;