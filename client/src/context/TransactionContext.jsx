import React, { createContext, useState, useCallback, useContext } from 'react';
import { useWalletContext } from './WalletContext';
import { useNotification } from './NotificationContext';

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
  const { executeTransaction, connected, walletAddress } = useWalletContext();
  const { success, error, info } = useNotification();
  
  // Transaction state
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  const [transactionLoading, setTransactionLoading] = useState(false);
  const [transactionError, setTransactionError] = useState(null);
  
  // Store for tracking multiple transactions by ID
  const [transactionStore, setTransactionStore] = useState({});

  // Execute a transaction with tracking
  const executeTransactionWithTracking = useCallback(async (transactionData) => {
    if (!connected) {
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
      info('Preparing transaction: ' + newTransaction.description, {
        title: 'Transaction Initiated'
      });
      
      // Execute the transaction
      const result = await executeTransaction(transactionData.payload);
      
      // Update transaction status
      const updatedTransaction = {
        ...newTransaction,
        status: result.success ? TRANSACTION_STATUS.CONFIRMED : TRANSACTION_STATUS.FAILED,
        hash: result.result?.hash,
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
      
      // Show success/error notification
      if (result.success) {
        success('Transaction complete: ' + updatedTransaction.description, {
          title: 'Transaction Confirmed',
          autoDismiss: 7000
        });
      } else {
        error('Transaction failed: ' + (result.error || 'Unknown error'), {
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
      
      error('Transaction error: ' + (err.message || 'Unknown error'), {
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
  }, [connected, walletAddress, executeTransaction, success, error, info]);

  // Get transaction by ID
  const getTransaction = useCallback((transactionId) => {
    return transactionStore[transactionId] || null;
  }, [transactionStore]);

  // Check if a transaction is pending
  const isTransactionPending = useCallback((transactionId) => {
    const transaction = transactionStore[transactionId];
    return transaction && transaction.status === TRANSACTION_STATUS.PENDING;
  }, [transactionStore]);

  // Context value
  const value = {
    pendingTransactions,
    currentTransaction,
    transactionLoading,
    transactionError,
    executeTransactionWithTracking,
    getTransaction,
    isTransactionPending
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the transaction context
export const useTransaction = () => {
  const context = useContext(TransactionContext);
  if (context === null) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
};