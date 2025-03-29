import React, { createContext, useState, useContext, useCallback } from 'react';
import { useWalletContext } from './WalletContext';
import { useNotification } from './NotificationContext';

// Create transaction context
export const TransactionContext = createContext();

/**
 * TransactionProvider component to manage transaction state and execution
 */
export const TransactionProvider = ({ children }) => {
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  
  const { wallet, isConnected, executeTransaction } = useWalletContext();
  const { showNotification } = useNotification();
  
  /**
   * Execute a single transaction
   * @param {Object} txPayload - Transaction payload
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Transaction result
   */
  const executeSingleTransaction = useCallback(async (txPayload, options = {}) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    try {
      // Add to pending transactions
      const txId = Date.now().toString();
      const pendingTx = {
        id: txId,
        payload: txPayload,
        status: 'pending',
        timestamp: Date.now()
      };
      
      setPendingTransactions(prev => [...prev, pendingTx]);
      
      // Execute transaction
      const result = await executeTransaction(txPayload);
      
      // Update completed transactions
      const completedTx = {
        ...pendingTx,
        status: 'completed',
        result,
        completedAt: Date.now()
      };
      
      setCompletedTransactions(prev => [...prev, completedTx]);
      updateRecentTransactions(completedTx);
      
      // Remove from pending
      setPendingTransactions(prev => prev.filter(tx => tx.id !== txId));
      
      return result;
    } catch (error) {
      // Handle error
      const failedTx = {
        id: txId,
        payload: txPayload,
        status: 'failed',
        error: error.message || 'Transaction failed',
        timestamp: Date.now()
      };
      
      setCompletedTransactions(prev => [...prev, failedTx]);
      updateRecentTransactions(failedTx);
      
      // Remove from pending
      setPendingTransactions(prev => prev.filter(tx => tx.id !== txId));
      
      throw error;
    }
  }, [isConnected, executeTransaction]);
  
  /**
   * Execute a strategy consisting of multiple transactions
   * @param {Array} operations - Array of operations to execute
   * @param {Object} options - Additional options
   * @returns {Promise<Object>} - Execution results
   */
  const executeStrategy = useCallback(async (operations, options = {}) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }
    
    if (!operations || operations.length === 0) {
      throw new Error('No operations provided for execution');
    }
    
    setIsExecuting(true);
    showNotification('Starting strategy execution...', 'info');
    
    try {
      const results = {
        success: true,
        operations: [],
        failedOperations: [],
        startTime: Date.now()
      };
      
      // Execute operations sequentially
      for (const operation of operations) {
        try {
          // Create transaction payload
          const amountInOctas = Math.floor(parseFloat(operation.amount) * 100000000).toString();
          const txPayload = {
            function: `${operation.contractAddress}${operation.functionName}`,
            type_arguments: [],
            arguments: [amountInOctas]
          };
          
          // Execute transaction
          const txResult = await executeSingleTransaction(txPayload, options);
          
          // Add to successful operations
          results.operations.push({
            ...operation,
            result: txResult,
            status: 'success'
          });
          
          // Show success notification
          showNotification(`Successfully executed ${operation.type} on ${operation.protocol}`, 'success');
          
        } catch (error) {
          console.error(`Operation failed: ${operation.type} on ${operation.protocol}`, error);
          
          // Add to failed operations
          results.failedOperations.push({
            ...operation,
            error: error.message,
            status: 'failed'
          });
          
          // Show error notification
          showNotification(`Failed to execute ${operation.type} on ${operation.protocol}: ${error.message}`, 'error');
          
          results.success = false;
        }
      }
      
      // Add final metrics
      results.endTime = Date.now();
      results.duration = results.endTime - results.startTime;
      results.totalOperations = operations.length;
      results.successfulOperations = results.operations.length;
      
      // Show final notification
      showNotification(
        results.success 
          ? `Strategy executed successfully! ${results.operations.length} operations completed.` 
          : `Strategy execution completed with ${results.failedOperations.length} failures.`,
        results.success ? 'success' : 'warning'
      );
      
      return results;
    } catch (error) {
      console.error('Strategy execution error:', error);
      showNotification(`Strategy execution failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    } finally {
      setIsExecuting(false);
    }
  }, [isConnected, executeSingleTransaction, showNotification]);

  /**
   * Add a transaction to the transaction history
   * @param {Object} transaction - Transaction to add
   */
  const addTransaction = useCallback((transaction) => {
    // Add to completed transactions
    setCompletedTransactions(prev => [...prev, {
      ...transaction,
      added: Date.now()
    }]);
    
    // Update recent transactions
    updateRecentTransactions(transaction);
  }, []);
  
  /**
   * Update recent transactions list
   * @param {Object} transaction - Transaction to add
   */
  const updateRecentTransactions = useCallback((transaction) => {
    setRecentTransactions(prev => {
      // Add new transaction to the start of the array
      const updated = [transaction, ...prev];
      
      // Keep only the 10 most recent transactions
      if (updated.length > 10) {
        updated.length = 10;
      }
      
      return updated;
    });
  }, []);
  
  /**
   * Clear all transaction history
   */
  const clearTransactionHistory = useCallback(() => {
    setCompletedTransactions([]);
    setRecentTransactions([]);
  }, []);
  
  /**
   * Get transaction by ID
   * @param {string} id - Transaction ID
   * @returns {Object|null} - Transaction or null if not found
   */
  const getTransactionById = useCallback((id) => {
    return [...pendingTransactions, ...completedTransactions].find(tx => tx.id === id) || null;
  }, [pendingTransactions, completedTransactions]);

  // Context value
  const contextValue = {
    pendingTransactions,
    completedTransactions,
    recentTransactions,
    isExecuting,
    executeSingleTransaction,
    executeStrategy,
    addTransaction,
    clearTransactionHistory,
    getTransactionById
  };

  return (
    <TransactionContext.Provider value={contextValue}>
      {children}
    </TransactionContext.Provider>
  );
};

/**
 * Hook to use transaction context
 * @returns {Object} - Transaction context
 */
export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

export default TransactionContext;