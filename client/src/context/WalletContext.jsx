import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AptosWalletAdapter } from '@aptos-labs/wallet-adapter-react';
import api from '../services/api';
import { useNotifications } from './NotificationContext';
import { NOTIFICATION_TYPES, PRIORITY } from './NotificationContext';

// Create wallet context
const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  // State for wallet connection
  const [wallet, setWallet] = useState(null);
  const [walletAddress, setWalletAddress] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectError, setConnectError] = useState(null);
  
  // Portfolio state
  const [portfolioData, setPortfolioData] = useState(null);
  const [isLoadingPortfolio, setIsLoadingPortfolio] = useState(false);
  const [portfolioError, setPortfolioError] = useState(null);
  
  // Transaction state
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  
  // Get notifications context for creating transaction notifications
  const { createTransactionNotification } = useNotifications();

  // Initialize wallet connection
  const initializeWallet = useCallback(async () => {
    try {
      // Check for existing wallet connection in local storage
      const savedWalletAddress = localStorage.getItem('walletAddress');
      if (savedWalletAddress) {
        setWalletAddress(savedWalletAddress);
        setIsConnected(true);
        
        // Load wallet data
        await fetchPortfolioData(savedWalletAddress);
        await fetchTransactionHistory(savedWalletAddress);
      }
    } catch (error) {
      console.error('Error initializing wallet:', error);
      setConnectError('Failed to initialize wallet connection');
    }
  }, []);

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setIsConnecting(true);
    setConnectError(null);
    
    try {
      // Create Aptos wallet adapter instance
      const walletAdapter = new AptosWalletAdapter();
      
      // Initialize wallet
      await walletAdapter.connect();
      
      if (!walletAdapter.connected) {
        throw new Error('Failed to connect wallet');
      }
      
      // Get wallet account
      const account = walletAdapter.accounts[0];
      if (!account) {
        throw new Error('No accounts found in wallet');
      }
      
      // Store wallet address
      const address = account.address;
      setWallet(walletAdapter);
      setWalletAddress(address);
      setIsConnected(true);
      
      // Store wallet address in local storage
      localStorage.setItem('walletAddress', address);
      
      // Load wallet data
      await fetchPortfolioData(address);
      await fetchTransactionHistory(address);
      
      return { success: true, address };
    } catch (error) {
      console.error('Wallet connection error:', error);
      setConnectError(error.message || 'Failed to connect wallet');
      return { success: false, error: error.message };
    } finally {
      setIsConnecting(false);
    }
  }, []);

  // Disconnect wallet
  const disconnectWallet = useCallback(() => {
    try {
      // Disconnect from wallet if available
      if (wallet) {
        wallet.disconnect();
      }
      
      // Clear wallet state
      setWallet(null);
      setWalletAddress('');
      setIsConnected(false);
      setPortfolioData(null);
      setPendingTransactions([]);
      setTransactionHistory([]);
      
      // Remove wallet address from local storage
      localStorage.removeItem('walletAddress');
      
      return { success: true };
    } catch (error) {
      console.error('Wallet disconnection error:', error);
      return { success: false, error: error.message };
    }
  }, [wallet]);

  // Fetch portfolio data
  const fetchPortfolioData = useCallback(async (address = walletAddress) => {
    if (!address) return null;
    
    setIsLoadingPortfolio(true);
    setPortfolioError(null);
    
    try {
      const response = await api.get(`/api/wallet/${address}`);
      setPortfolioData(response.data.portfolio);
      return response.data.portfolio;
    } catch (error) {
      console.error('Error fetching portfolio data:', error);
      setPortfolioError('Failed to load portfolio data');
      return null;
    } finally {
      setIsLoadingPortfolio(false);
    }
  }, [walletAddress]);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async (address = walletAddress, limit = 20) => {
    if (!address) return [];
    
    try {
      const response = await api.get(`/api/wallet/${address}/transactions?limit=${limit}`);
      setTransactionHistory(response.data.transactions || []);
      
      // Update pending transactions
      const pendingTxs = response.data.transactions.filter(tx => 
        tx.status === 'pending' || tx.status === 'submitted'
      );
      setPendingTransactions(pendingTxs);
      
      return response.data.transactions;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      return [];
    }
  }, [walletAddress]);

  // Execute transaction
  const executeTransaction = useCallback(async (transactionPayload) => {
    if (!wallet || !isConnected) {
      throw new Error('Wallet not connected');
    }
    
    setIsExecuting(true);
    
    try {
      // Create transaction payload
      const payload = {
        function: transactionPayload.function,
        type_arguments: transactionPayload.typeArguments || [],
        arguments: transactionPayload.arguments || []
      };
      
      // Sign and submit transaction
      const pendingTransaction = await wallet.signAndSubmitTransaction(payload);
      
      // Create a pending transaction record
      const txRecord = {
        hash: pendingTransaction.hash,
        status: 'pending',
        type: transactionPayload.type || 'execution',
        protocol: transactionPayload.protocol || '',
        amount: transactionPayload.amount || '0',
        timestamp: new Date().toISOString()
      };
      
      // Update pending transactions list
      setPendingTransactions(prev => [...prev, txRecord]);
      
      // Create transaction notification
      await createTransactionNotification(txRecord);
      
      // Set up transaction monitoring
      monitorTransaction(txRecord.hash, txRecord);
      
      return {
        success: true,
        hash: pendingTransaction.hash,
        status: 'pending'
      };
    } catch (error) {
      console.error('Transaction execution error:', error);
      
      // Create failure notification
      await createTransactionNotification({
        status: 'failed',
        type: transactionPayload.type || 'execution',
        protocol: transactionPayload.protocol || '',
        amount: transactionPayload.amount || '0',
        error: error.message
      });
      
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [wallet, isConnected, createTransactionNotification]);

  // Monitor transaction status
  const monitorTransaction = useCallback(async (txHash, txRecord) => {
    let attempts = 0;
    const maxAttempts = 30;
    const delay = 2000; // 2 seconds
    
    const checkStatus = async () => {
      try {
        if (attempts >= maxAttempts) {
          // Transaction status check timed out
          const timeoutTx = { ...txRecord, status: 'unknown' };
          
          // Update transaction status in state
          setPendingTransactions(prev => 
            prev.filter(tx => tx.hash !== txHash)
          );
          
          // Create notification
          await createTransactionNotification(timeoutTx);
          return;
        }
        
        // Check transaction status
        const response = await api.get(`/api/transactions/${txHash}`);
        
        if (response.data.status === 'confirmed' || response.data.status === 'failed') {
          // Transaction is complete
          const completedTx = { ...txRecord, status: response.data.status };
          
          // Update transaction status in state
          setPendingTransactions(prev => 
            prev.filter(tx => tx.hash !== txHash)
          );
          
          // Create notification
          await createTransactionNotification(completedTx);
          
          // Refresh portfolio data
          await fetchPortfolioData();
          
          // Refresh transaction history
          await fetchTransactionHistory();
          
          return;
        }
        
        // Continue monitoring
        attempts++;
        setTimeout(checkStatus, delay);
      } catch (error) {
        console.error('Error monitoring transaction:', error);
        attempts++;
        setTimeout(checkStatus, delay);
      }
    };
    
    // Start monitoring
    setTimeout(checkStatus, delay);
  }, [createTransactionNotification, fetchPortfolioData, fetchTransactionHistory]);

  // Execute strategy (multiple operations)
  const executeStrategy = useCallback(async (strategy) => {
    if (!wallet || !isConnected) {
      throw new Error('Wallet not connected');
    }
    
    if (!strategy || !strategy.operations || !strategy.operations.length) {
      throw new Error('Invalid strategy: No operations to execute');
    }
    
    setIsExecuting(true);
    
    try {
      // Execute strategy through API
      const response = await api.post('/api/execute-strategy', {
        walletAddress,
        amount: strategy.amount || 0,
        allocation: strategy.allocation || [],
        operations: strategy.operations
      });
      
      // Refresh portfolio after execution
      await fetchPortfolioData();
      await fetchTransactionHistory();
      
      return response.data;
    } catch (error) {
      console.error('Strategy execution error:', error);
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [wallet, isConnected, walletAddress, fetchPortfolioData, fetchTransactionHistory]);

  // Initialize wallet on mount
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  // Auto-refresh portfolio data
  useEffect(() => {
    if (!isConnected || !walletAddress) return;
    
    // Refresh portfolio data every 60 seconds
    const interval = setInterval(() => {
      fetchPortfolioData();
    }, 60000);
    
    return () => clearInterval(interval);
  }, [isConnected, walletAddress, fetchPortfolioData]);

  // Context value
  const value = {
    wallet,
    walletAddress,
    isConnecting,
    isConnected,
    connectError,
    portfolioData,
    isLoadingPortfolio,
    portfolioError,
    pendingTransactions,
    transactionHistory,
    isExecuting,
    connectWallet,
    disconnectWallet,
    fetchPortfolioData,
    fetchTransactionHistory,
    executeTransaction,
    executeStrategy
  };

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  );
};

// Custom hook to use the wallet context
export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export default WalletContext;