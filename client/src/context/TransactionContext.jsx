// src/context/TransactionContext.jsx

import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { useWalletContext } from './WalletContext';
import { executeStrategy, executeTransaction } from '../services/transactionService';
import { showNotification } from '../utils/animations';
import { useNotification } from './NotificationContext';

// Create the context
export const TransactionContext = createContext({});

import { useNotification } from './NotificationContext';
    });
  }, []);

  // Execute a transaction
  const executeTransactionWithState = useCallback(async (payload, options = {}) => {
    if (!isConnected || !wallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Add to pending transactions
      const pendingTx = {
        id: Date.now().toString(),
        type: payload.type || 'transaction',
        status: 'pending',
        timestamp: new Date().toISOString(),
        payload
      };
      
      setPendingTransactions(prev => [pendingTx, ...prev]);
      setCurrentTransaction(pendingTx);
      
      // Execute the transaction
      const result = await executeTransaction(
        wallet,
        payload,
        options
      );
      
      // Update the transaction status
      const completedTx = {
        ...pendingTx,
        status: result.success ? 'success' : 'failed',
        result,
        error: result.error
      };
      
      setPendingTransactions(prev => 
        prev.filter(tx => tx.id !== pendingTx.id)
      );
      
      // Add to history
      addTransaction(completedTx);
      
      // Clear current transaction
      setCurrentTransaction(null);
      
      // Show notification
      if (result.success) {
        showNotification('Transaction successful!', 'success');
      } else {
        showNotification(`Transaction failed: ${result.error}`, 'error');
      }
      
      // Refresh portfolio after successful transaction
      if (result.success) {
        setTimeout(() => refreshPortfolio(), 2000);
      }
      
      return result;
    } catch (err) {
      console.error('Transaction execution error:', err);
      setError(err.message || 'Transaction failed');
      
      // Add failed transaction to history
      const failedTx = {
        id: Date.now().toString(),
        type: payload.type || 'transaction',
        status: 'failed',
        timestamp: new Date().toISOString(),
        payload,
        error: err.message
      };
      
      addTransaction(failedTx);
      
      // Clear from pending
      setPendingTransactions(prev => 
        prev.filter(tx => tx.id !== (currentTransaction?.id || ''))
      );
      
      // Clear current transaction
      setCurrentTransaction(null);
      
      // Show notification
      showNotification(err.message || 'Transaction failed', 'error');
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, wallet, addTransaction, refreshPortfolio]);

  // Execute a strategy (multiple transactions)
  const executeStrategyWithState = useCallback(async (operations, options = {}, onProgress = null) => {
    if (!isConnected || !wallet) {
      throw new Error('Wallet not connected');
    }

    setIsLoading(true);
    setError(null);
    
    try {
      // Create strategy transaction record
      const strategyTx = {
        id: Date.now().toString(),
        type: 'strategy',
        status: 'pending',
        timestamp: new Date().toISOString(),
        operations,
        progress: 0
      };
      
      setPendingTransactions(prev => [strategyTx, ...prev]);
      setCurrentTransaction(strategyTx);
      
      // Progress callback
      const handleProgress = (index, result) => {
        // Update progress
        const progress = Math.round(((index + 1) / operations.length) * 100);
        
        // Update pending transaction
        setPendingTransactions(prev => {
          return prev.map(tx => {
            if (tx.id === strategyTx.id) {
              return { ...tx, progress };
            }
            return tx;
          });
        });
        
        // Update current transaction
        setCurrentTransaction(prev => {
          if (prev && prev.id === strategyTx.id) {
            return { ...prev, progress };
          }
          return prev;
        });
        
        // Call external progress handler if provided
        if (onProgress) {
          onProgress(index, result, progress);
        }
      };
      
      // Execute the strategy
      const result = await executeStrategy(
        wallet,
        operations,
        options,
        handleProgress
      );
      
      // Update the transaction status
      const completedStrategy = {
        ...strategyTx,
        status: result.success ? 'success' : result.operations.length > 0 ? 'partial' : 'failed',
        result,
        error: result.error,
        operations: result.operations,
        failedOperations: result.failedOperations,
        progress: 100
      };
      
      // Remove from pending
      setPendingTransactions(prev => 
        prev.filter(tx => tx.id !== strategyTx.id)
      );
      
      // Add to history
      addTransaction(completedStrategy);
      
      // Clear current transaction
      setCurrentTransaction(null);
      
      // Show notification
      if (result.success) {
        showNotification(`Strategy executed successfully with ${result.operations.length} operations!`, 'success');
      } else if (result.operations.length > 0) {
        showNotification(`Strategy partially executed with ${result.failedOperations.length} failures`, 'warning');
      } else {
        showNotification(`Strategy execution failed: ${result.error}`, 'error');
      }
      
      // Refresh portfolio after execution
      setTimeout(() => refreshPortfolio(), 2000);
      
      return result;
    } catch (err) {
      console.error('Strategy execution error:', err);
      setError(err.message || 'Strategy execution failed');
      
      // Add failed strategy to history
      const failedStrategy = {
        id: Date.now().toString(),
        type: 'strategy',
        status: 'failed',
        timestamp: new Date().toISOString(),
        operations,
        error: err.message
      };
      
      addTransaction(failedStrategy);
      
      // Remove from pending
      setPendingTransactions(prev => 
        prev.filter(tx => tx.id !== (currentTransaction?.id || ''))
      );
      
      // Clear current transaction
      setCurrentTransaction(null);
      
      // Show notification
      showNotification(err.message || 'Strategy execution failed', 'error');
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [isConnected, wallet, addTransaction, refreshPortfolio]);

  // Clear transaction history
  const clearHistory = useCallback(() => {
    setTransactionHistory([]);
    localStorage.removeItem('transactionHistory');
  }, []);

  // Context value
  const contextValue = {
    pendingTransactions,
    transactionHistory,
    isLoading,
    currentTransaction,
    error,
    executeTransaction: executeTransactionWithState,
    executeStrategyTransaction: executeStrategyWithState,
    addTransaction,
    clearHistory
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
}

// Custom hook to use the TransactionContext
export const useTransactionContext = () => useContext(TransactionContext);

export default TransactionContext;