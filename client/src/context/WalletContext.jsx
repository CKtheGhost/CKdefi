// src/context/WalletContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { showNotification } from '../utils/animations';
import { executeTransaction } from '../services/transactionService';

// Create the context
export const WalletContext = createContext({});

/**
 * Provider component for wallet-related functionality
 */
export function WalletProvider({ children }) {
  // State variables
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState('');
  const [shortenedAddress, setShortenedAddress] = useState('');
  const [walletProvider, setWalletProvider] = useState(null);
  const [balance, setBalance] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [portfolioData, setPortfolioData] = useState(null);
  const [portfolioLoading, setPortfolioLoading] = useState(false);
  const [error, setError] = useState(null);
  const [connecting, setConnecting] = useState(false);

  // Use Aptos wallet adapter
  const {
    connect,
    account,
    network,
    connected,
    disconnect: disconnectWallet,
    wallets,
    wallet,
    signAndSubmitTransaction
  } = useWallet();

  // Check initial connection status
  useEffect(() => {
    checkConnection();
  }, [account, connected]);

  // Update wallet data when connected
  useEffect(() => {
    if (isConnected && address) {
      updateWalletData();
      refreshPortfolio();
    }
  }, [isConnected, address]);

  // Check if wallet is connected
  const checkConnection = useCallback(() => {
    const isConnected = connected && !!account?.address;
    setIsConnected(isConnected);

    if (isConnected) {
      const addr = account.address.toString();
      setAddress(addr);
      setShortenedAddress(`${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`);
      setWalletProvider(wallet.name);
      
      // Set chain ID based on network
      if (network) {
        setChainId(network.chainId);
      }
    } else {
      setAddress('');
      setShortenedAddress('');
      setWalletProvider(null);
      setBalance(null);
      setChainId(null);
    }
  }, [account, connected, wallet, network]);

  // Update wallet data (balance, etc.)
  const updateWalletData = useCallback(async () => {
    if (!isConnected || !address) return;

    try {
      // Get balance using the client or wallet API
      // This implementation depends on the specific wallet provider
      let balanceValue = null;

      if (wallet && wallet.getBalance) {
        balanceValue = await wallet.getBalance();
      } else if (window.aptos) {
        const response = await window.aptos.getAccountResources(address);
        const accountResource = response.find(
          (r) => r.type === '0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>'
        );
        
        if (accountResource && accountResource.data && accountResource.data.coin) {
          // Convert octas to APT (1 APT = 10^8 octas)
          balanceValue = parseFloat(accountResource.data.coin.value) / 100000000;
        }
      }

      setBalance(balanceValue);
    } catch (err) {
      console.error('Error updating wallet data:', err);
      setError('Failed to load wallet data');
    }
  }, [isConnected, address, wallet]);

  // Connect wallet
  const connectWallet = useCallback(async (walletName = null) => {
    try {
      setConnecting(true);
      setError(null);

      // If walletName is provided, find that specific wallet
      const targetWallet = walletName
        ? wallets.find(w => w.name.toLowerCase() === walletName.toLowerCase())
        : wallet;

      if (!targetWallet) {
        throw new Error(`Wallet "${walletName}" not found. Please install the wallet extension.`);
      }

      // Connect to the wallet
      await connect(targetWallet.name);
      
      return true;
    } catch (err) {
      console.error('Wallet connection error:', err);
      setError(err.message || 'Failed to connect wallet');
      showNotification(err.message || 'Failed to connect wallet', 'error');
      return false;
    } finally {
      setConnecting(false);
    }
  }, [connect, wallets, wallet]);

  // Disconnect wallet
  const disconnect = useCallback(async () => {
    try {
      await disconnectWallet();
      setIsConnected(false);
      setAddress('');
      setShortenedAddress('');
      setWalletProvider(null);
      setBalance(null);
      setChainId(null);
      setPortfolioData(null);
      
      showNotification('Wallet disconnected', 'info');
      return true;
    } catch (err) {
      console.error('Wallet disconnect error:', err);
      setError(err.message || 'Failed to disconnect wallet');
      return false;
    }
  }, [disconnectWallet]);

  // Execute transaction
  const executeTransactionWithWallet = useCallback(async (payload, options = {}) => {
    if (!isConnected || !signAndSubmitTransaction) {
      throw new Error('Wallet not connected');
    }

    try {
      // Execute the transaction
      const result = await executeTransaction(
        { signAndSubmitTransaction }, // Wrap the function
        payload,
        options
      );

      if (result.success) {
        showNotification('Transaction successful!', 'success');
        // Refresh portfolio after successful transaction
        setTimeout(() => refreshPortfolio(), 2000);
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }

      return result;
    } catch (err) {
      console.error('Transaction execution error:', err);
      const errorMsg = err.message || 'Transaction failed';
      showNotification(errorMsg, 'error');
      throw err;
    }
  }, [isConnected, signAndSubmitTransaction]);

  // Refresh portfolio data
  const refreshPortfolio = useCallback(async () => {
    if (!isConnected || !address) return;

    try {
      setPortfolioLoading(true);
      setError(null);

      // Call API to get portfolio data
      const response = await fetch(`/api/wallet/${address}/portfolio`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch portfolio data');
      }

      const data = await response.json();
      setPortfolioData(data);
      
      // Update balance if available in portfolio data
      if (data.apt && data.apt.amount) {
        setBalance(parseFloat(data.apt.amount));
      }

      return data;
    } catch (err) {
      console.error('Error fetching portfolio:', err);
      setError(err.message || 'Failed to load portfolio data');
      
      // Try to use mock data for development
      if (process.env.NODE_ENV === 'development') {
        try {
          const mockData = await import('../mocks/portfolioData.json');
          setPortfolioData(mockData.default);
          return mockData.default;
        } catch (mockErr) {
          console.log('No mock data available');
        }
      }
      
      return null;
    } finally {
      setPortfolioLoading(false);
    }
  }, [isConnected, address]);

  // Context value
  const contextValue = {
    isConnected,
    connecting,
    address,
    shortenedAddress,
    walletProvider,
    balance,
    chainId,
    portfolioData,
    portfolioLoading,
    error,
    connectWallet,
    disconnect,
    executeTransaction: executeTransactionWithWallet,
    refreshPortfolio,
    wallet
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
}

// Custom hook to use the WalletContext
export const useWalletContext = () => useContext(WalletContext);

export default WalletContext;