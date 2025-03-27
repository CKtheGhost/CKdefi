import React, { createContext, useState, useCallback, useContext, useEffect } from 'react';
import { WalletContext } from './WalletContext';
import { UserContext } from './UserContext';
import { NotificationContext } from './NotificationContext';

// Transaction statuses
export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMING: 'confirming',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  REJECTED: 'rejected'
};

// Transaction types
export const TRANSACTION_TYPES = {
  STAKE: 'stake',
  UNSTAKE: 'unstake',
  SWAP: 'swap',
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  CLAIM: 'claim',
  REBALANCE: 'rebalance',
  APPROVE: 'approve',
  TRANSFER: 'transfer',
  OTHER: 'other'
};

// Create the context
export const TransactionContext = createContext(null);

export const TransactionProvider = ({ children }) => {
  // Access other contexts
  const wallet = useContext(WalletContext);
  const user = useContext(UserContext);
  const notification = useContext(NotificationContext);
  
  const { executeTransaction, walletAddress, isConnected } = wallet;
  const { addTransaction } = user;
  const { success, error, info } = notification;
  
  // Transaction state
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  
  // Store for tracking multiple transactions by ID
  const [transactionStore, setTransactionStore] = useState({});

  // Clean up completed transactions periodically
  useEffect(() => {
    const cleanup = setInterval(() => {
      // Remove confirmed transactions older than 10 minutes
      const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
      
      setPendingTransactions(prev => 
        prev.filter(tx => 
          tx.status !== TRANSACTION_STATUS.CONFIRMED || 
          tx.updatedAt > tenMinutesAgo
        )
      );
    }, 60000); // Run every minute
    
    return () => clearInterval(cleanup);
  }, []);

  // Execute a transaction
  const executeTransactionWithTracking = useCallback(async (transactionData) => {
    if (!isConnected) {
      error('Wallet not connected. Please connect your wallet to continue.');
      return { success: false, error: 'Wallet not connected' };
    }
    
    try {
      setTransactionLoading(true);
      setTransactionError(null);
      
      // Create transaction object
      const txId = `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const newTransaction = {
        id: txId,
        type: transactionData.type || TRANSACTION_TYPES.OTHER,
        description: transactionData.description || 'Transaction',
        amount: transactionData.amount,
        token: transactionData.token,
        status: TRANSACTION_STATUS.PENDING,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        payload: transactionData.payload,
        protocol: transactionData.protocol,
        walletAddress
      };
      
      // Add to pending transactions
      setPendingTransactions(prev => [...prev, newTransaction]);
      setCurrentTransaction(newTransaction);
      
      // Add to transaction store
      setTransactionStore(prev => ({
        ...prev,
        [txId]: newTransaction
      }));
      
      // Show notification
      info(`Preparing transaction: ${newTransaction.description}`, {
        title: 'Transaction Initiated'
      });
      
      // Execute the transaction
      const result = await executeTransaction(transactionData.payload);
      
      // Update transaction status
      const updatedTransaction = {
        ...newTransaction,
        status: result.success ? TRANSACTION_STATUS.CONFIRMED : TRANSACTION_STATUS.FAILED,
        hash: result.hash,
        error: result.error,
        updatedAt: Date.now(),
        result: result.result
      };
      
      // Update pending transactions
      setPendingTransactions(prev => 
        prev.map(tx => tx.id === txId ? updatedTransaction : tx)
      );
      
      // Update transaction store
      setTransactionStore(prev => ({
        ...prev,
        [txId]: updatedTransaction
      }));
      
      setCurrentTransaction(updatedTransaction);
      
      // Add to transaction history
      addTransaction(updatedTransaction);
      
      // Show success/error notification
      if (result.success) {
        success(`Transaction complete: ${updatedTransaction.description}`, {
          title: 'Transaction Confirmed',
          autoDismiss: 7000
        });
      } else {
        error(`Transaction failed: ${result.error || 'Unknown error'}`, {
          title: 'Transaction Failed',
          autoDismiss: 0
        });
      }
      
      return {
        ...result,
        transaction: updatedTransaction
      };
    } catch (err) {
      // Handle any errors
      setTransactionError(err.message || 'Transaction failed');
      
      error(`Transaction error: ${err.message || 'Unknown error'}`, {
        title: 'Transaction Error',
        autoDismiss: 0
      });
      
      return {
        success: false,
        error: err.message || 'Transaction failed'
      };
    } finally {
      setTransactionLoading(false);
    }
  }, [isConnected, walletAddress, executeTransaction, addTransaction, success, error, info]);

  // Get transaction by ID
  const getTransaction = useCallback((transactionId) => {
    return transactionStore[transactionId] || null;
  }, [transactionStore]);

  // Check if a transaction is pending
  const isTransactionPending = useCallback((transactionId) => {
    const transaction = transactionStore[transactionId];
    return transaction && transaction.status === TRANSACTION_STATUS.PENDING;
  }, [transactionStore]);

  // Create stake transaction payload
  const createStakeTransaction = useCallback((protocol, amount, options = {}) => {
    // Construct the appropriate transaction payload based on the protocol
    const { contracts } = require('../utils/constants');
    
    // Default to Amnis if not specified
    const protocolAddress = protocol ? contracts[protocol.toLowerCase()] : contracts.amnis;
    
    return {
      type: TRANSACTION_TYPES.STAKE,
      description: `Stake ${amount} APT with ${protocol || 'Amnis'}`,
      amount,
      token: 'APT',
      protocol: protocol || 'amnis',
      payload: {
        type: 'entry_function_payload',
        function: `${protocolAddress}::staking::stake`,
        type_arguments: [],
        arguments: [amount * 1e8] // Convert to atomic units
      },
      ...options
    };
  }, []);

  // Create unstake transaction payload
  const createUnstakeTransaction = useCallback((protocol, amount, options = {}) => {
    // Construct the appropriate transaction payload based on the protocol
    const { contracts } = require('../utils/constants');
    
    // Default to Amnis if not specified
    const protocolAddress = protocol ? contracts[protocol.toLowerCase()] : contracts.amnis;
    
    return {
      type: TRANSACTION_TYPES.UNSTAKE,
      description: `Unstake ${amount} ${protocol || 'Amnis'} APT`,
      amount,
      token: protocol === 'amnis' ? 'stAPT' : protocol === 'thala' ? 'sthAPT' : 'tAPT',
      protocol: protocol || 'amnis',
      payload: {
        type: 'entry_function_payload',
        function: `${protocolAddress}::staking::unstake`,
        type_arguments: [],
        arguments: [amount * 1e8] // Convert to atomic units
      },
      ...options
    };
  }, []);

  // Create swap transaction payload
  const createSwapTransaction = useCallback((fromToken, toToken, amount, options = {}) => {
    // This would construct a swap payload for the appropriate DEX
    // Implementation depends on the specific DEXes you're integrating with
    return {
      type: TRANSACTION_TYPES.SWAP,
      description: `Swap ${amount} ${fromToken} to ${toToken}`,
      amount,
      token: fromToken,
      toToken,
      payload: {
        // Swap payload details would go here
        // This is a placeholder
        type: 'entry_function_payload',
        function: '0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12::router::swap_exact_input',
        type_arguments: [],
        arguments: []
      },
      ...options
    };
  }, []);

  // Create a rebalance transaction
  const createRebalanceTransaction = useCallback((allocations, options = {}) => {
    return {
      type: TRANSACTION_TYPES.REBALANCE,
      description: `Portfolio rebalance across ${allocations.length} protocols`,
      amount: null, // Total amount will be calculated during execution
      token: 'APT',
      allocations,
      payload: {
        // The actual payload would be constructed at execution time
        // based on the allocations and current portfolio
        type: 'entry_function_payload',
        function: 'rebalance',
        allocations
      },
      ...options
    };
  }, []);

  // Execute a rebalance transaction
  const executeRebalance = useCallback(async (allocations) => {
    if (!isConnected) {
      error('Wallet not connected. Please connect your wallet to continue.');
      return { success: false, error: 'Wallet not connected' };
    }
    
    try {
      setTransactionLoading(true);
      
      // Create transaction object
      const rebalanceTransaction = createRebalanceTransaction(allocations);
      
      // Execute the rebalance
      // This would likely involve multiple transactions in sequence
      // For now, we'll use a placeholder implementation
      const result = await executeTransactionWithTracking(rebalanceTransaction);
      
      return result;
    } catch (err) {
      error(`Rebalance error: ${err.message || 'Unknown error'}`, {
        title: 'Rebalance Failed',
        autoDismiss: 0
      });
      
      return {
        success: false,
        error: err.message || 'Rebalance failed'
      };
    } finally {
      setTransactionLoading(false);
    }
  }, [isConnected, createRebalanceTransaction, executeTransactionWithTracking, error]);

  // Context value
  const value = {
    pendingTransactions,
    currentTransaction,
    transactionLoading,
    transactionError,
    executeTransactionWithTracking,
    getTransaction,
    isTransactionPending,
    createStakeTransaction,
    createUnstakeTransaction,
    createSwapTransaction,
    createRebalanceTransaction,
    executeRebalance
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransaction = () => {
  const context = React.useContext(TransactionContext);
  if (context === null) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};