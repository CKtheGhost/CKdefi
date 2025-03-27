import React, { createContext, useState, useEffect, useCallback } from 'react';
import { AptosWalletAdapter } from '@aptos-labs/wallet-adapter-react';

// Create the context
export const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  // Wallet connection state
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletProvider, setWalletProvider] = useState(null);
  const [connectionError, setConnectionError] = useState(null);
  const [loading, setLoading] = useState(false);
  
  // Portfolio data
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);

  // Connect wallet function
  const connectWallet = useCallback(async (provider = 'petra') => {
    try {
      setLoading(true);
      setConnectionError(null);
      
      let walletAdapter;
      
      // Initialize the appropriate adapter based on provider
      switch (provider) {
        case 'petra':
          walletAdapter = new AptosWalletAdapter();
          break;
        case 'martian':
          // Initialize Martian adapter
          break;
        case 'pontem':
          // Initialize Pontem adapter
          break;
        default:
          walletAdapter = new AptosWalletAdapter();
      }
      
      // Connect to the wallet
      await walletAdapter.connect();
      
      // Get the wallet account
      const account = await walletAdapter.account();
      
      if (account && account.address) {
        setWalletAddress(account.address);
        setWalletProvider(walletAdapter);
        setIsConnected(true);
        
        // Store wallet connection in localStorage
        localStorage.setItem('walletConnected', 'true');
        localStorage.setItem('walletProvider', provider);
        localStorage.setItem('walletAddress', account.address);
        
        // Load portfolio data
        fetchPortfolioData(account.address);
      } else {
        throw new Error('Failed to get wallet address');
      }
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectionError(error.message || 'Failed to connect wallet');
      
      // Clear any stored wallet data
      localStorage.removeItem('walletConnected');
      localStorage.removeItem('walletProvider');
      localStorage.removeItem('walletAddress');
    } finally {
      setLoading(false);
    }
  }, []);

  // Disconnect wallet function
  const disconnectWallet = useCallback(() => {
    if (walletProvider && typeof walletProvider.disconnect === 'function') {
      try {
        walletProvider.disconnect();
      } catch (error) {
        console.error('Error disconnecting wallet:', error);
      }
    }
    
    // Reset state
    setWalletAddress(null);
    setWalletProvider(null);
    setIsConnected(false);
    setPortfolioData(null);
    
    // Clear localStorage
    localStorage.removeItem('walletConnected');
    localStorage.removeItem('walletProvider');
    localStorage.removeItem('walletAddress');
  }, [walletProvider]);

  // Function to fetch portfolio data
  const fetchPortfolioData = useCallback(async (address) => {
    if (!address) return;
    
    try {
      setPortfolioLoading(true);
      setPortfolioError(null);
      
      const response = await fetch(`/api/wallet/${address}`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch portfolio data: ${response.statusText}`);
      }
      
      const data = await response.json();
      setPortfolioData(data);
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setPortfolioError(error.message || 'Failed to load portfolio data');
    } finally {
      setPortfolioLoading(false);
    }
  }, []);

  // Refresh portfolio data
  const refreshPortfolio = useCallback(() => {
    if (walletAddress) {
      fetchPortfolioData(walletAddress);
    }
  }, [walletAddress, fetchPortfolioData]);

  // Check for stored wallet connection on mount
  useEffect(() => {
    const storedWalletConnected = localStorage.getItem('walletConnected');
    const storedProvider = localStorage.getItem('walletProvider');
    
    if (storedWalletConnected === 'true' && storedProvider) {
      connectWallet(storedProvider);
    }
  }, [connectWallet]);

  // Execute transaction on the connected wallet
  const executeTransaction = useCallback(async (transaction) => {
    if (!isConnected || !walletProvider) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Sign and submit the transaction
      const pendingTransaction = await walletProvider.signAndSubmitTransaction(transaction);
      
      // Wait for transaction to confirm
      const txnResult = await walletProvider.checkTransaction(pendingTransaction.hash);
      
      // Refresh portfolio data after successful transaction
      refreshPortfolio();
      
      return {
        success: true,
        hash: pendingTransaction.hash,
        result: txnResult
      };
    } catch (error) {
      console.error('Transaction execution error:', error);
      return {
        success: false,
        error: error.message || 'Failed to execute transaction'
      };
    }
  }, [isConnected, walletProvider, refreshPortfolio]);

  // Provider value
  const value = {
    walletAddress,
    isConnected,
    walletProvider,
    connectionError,
    loading,
    connectWallet,
    disconnectWallet,
    portfolioData,
    portfolioLoading,
    portfolioError,
    refreshPortfolio,
    executeTransaction
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = React.useContext(WalletContext);
  if (context === null) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};