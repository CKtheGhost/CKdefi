// src/context/TransactionContext.jsx
import React, { createContext, useState, useCallback, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import { useNotification } from './NotificationContext';

// Create context
export const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { wallet, address, isConnected } = useWalletContext();
  const { showNotification } = useNotification();
  
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isExecuting, setIsExecuting] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, pending, success, error
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  // Load transaction history from localStorage on mount
  useEffect(() => {
    try {
      const savedTransactions = localStorage.getItem('recentTransactions');
      if (savedTransactions) {
        setRecentTransactions(JSON.parse(savedTransactions));
      }
    } catch (error) {
      console.error('Failed to load transaction history:', error);
    }
  }, []);

  // Save transaction history to localStorage when it changes
  useEffect(() => {
    if (recentTransactions.length > 0) {
      localStorage.setItem('recentTransactions', JSON.stringify(recentTransactions));
    }
  }, [recentTransactions]);

  // Execute a single transaction
  const executeTransaction = useCallback(async (payload) => {
    if (!isConnected || !wallet) {
      setError('Wallet not connected');
      showNotification('Please connect your wallet to execute transactions', 'error');
      throw new Error('Wallet not connected');
    }

    try {
      setIsExecuting(true);
      setStatus('pending');
      setError(null);
      
      // Create transaction payload
      const transaction = {
        ...payload,
        sender: address,
      };

      // Add to pending transactions
      const txId = Date.now().toString();
      const pendingTx = { 
        id: txId, 
        payload: transaction, 
        status: 'pending',
        timestamp: Date.now()
      };
      
      setPendingTransactions(prev => [...prev, pendingTx]);

      // Send transaction to wallet for signing
      const response = await wallet.signAndSubmitTransaction(transaction);
      
      // Wait for transaction to complete
      // In a real implementation, you'd use an Aptos client to wait for the transaction
      // For demo purposes, we'll simulate a successful result
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const txResult = {
        success: true,
        hash: response.hash || `tx_${txId}`,
        gas_used: Math.floor(Math.random() * 1000),
        vm_status: "Executed successfully"
      };
      
      // Update transaction history
      const txRecord = {
        id: txId,
        hash: txResult.hash,
        success: txResult.success,
        timestamp: Date.now(),
        type: payload.function?.split('::').pop() || 'transaction',
        gasFee: txResult.gas_used || 0,
        payload: transaction
      };
      
      setRecentTransactions(prev => [txRecord, ...prev]);
      
      // Remove from pending
      setPendingTransactions(prev => prev.filter(tx => tx.id !== txId));
      
      // Update status and result
      setStatus('success');
      setResult(txResult);
      
      // Show notification
      showNotification(
        'Transaction completed successfully',
        'success'
      );
      
      return txResult;
    } catch (error) {
      console.error('Transaction failed:', error);
      
      setStatus('error');
      setError(error.message || 'Transaction failed');
      
      showNotification(`Transaction failed: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [wallet, address, isConnected, showNotification]);

  // Execute multiple transactions as a strategy
  const executeStrategyTransaction = useCallback(async (strategy, options = {}) => {
    if (!strategy || !strategy.operations || strategy.operations.length === 0) {
      throw new Error('Invalid strategy: no operations defined');
    }
    
    const results = {
      success: true,
      operations: [],
      failedOperations: [],
      timestamp: Date.now()
    };
    
    // Execute each operation sequentially
    for (const operation of strategy.operations) {
      try {
        // Prepare transaction payload
        const payload = {
          function: `${operation.contractAddress}${operation.functionName}`,
          type_arguments: [],
          arguments: operation.arguments || [operation.amount]
        };
        
        // Execute transaction
        const result = await executeTransaction(payload);
        
        // Add to successful operations
        results.operations.push({
          ...operation,
          hash: result.hash,
          status: 'success'
        });
      } catch (error) {
        console.error(`Operation failed: ${operation.type} on ${operation.protocol}`, error);
        
        // Add to failed operations
        results.failedOperations.push({
          ...operation,
          error: error.message,
          status: 'failed'
        });
        
        results.success = false;
      }
    }
    
    return results;
  }, [executeTransaction]);

  // Execute AI-recommended strategy
  const executeAIStrategy = useCallback(async (operations) => {
    if (!operations || operations.length === 0) {
      throw new Error('No operations provided for strategy execution');
    }

    try {
      setIsExecuting(true);
      setStatus('pending');
      setError(null);
      
      const results = {
        success: true,
        operations: [],
        failedOperations: [],
        timestamp: Date.now()
      };
      
      // Show strategy execution notification
      showNotification('Executing investment strategy...', 'info');
      
      // Execute each operation sequentially
      for (let i = 0; i < operations.length; i++) {
        const operation = operations[i];
        
        try {
          // Convert amount to octas (Aptos uses 8 decimal places)
          const amountInOctas = Math.floor(parseFloat(operation.amount) * 100000000).toString();
          
          // Create transaction payload
          const txPayload = {
            function: `${operation.contractAddress}${operation.functionName}`,
            type_arguments: [],
            arguments: [amountInOctas]
          };
          
          // Execute transaction
          const txResult = await executeTransaction(txPayload);
          
          // Add to successful operations
          results.operations.push({
            ...operation,
            hash: txResult.hash,
            status: 'success'
          });
          
          // Show success notification for each step
          showNotification(
            `Successfully executed ${operation.type} on ${operation.protocol}`,
            'success'
          );
          
        } catch (error) {
          console.error(`Operation failed: ${operation.type} on ${operation.protocol}`, error);
          
          // Add to failed operations
          results.failedOperations.push({
            ...operation,
            error: error.message,
            status: 'failed'
          });
          
          results.success = false;
          
          // Show error notification
          showNotification(
            `Failed to execute ${operation.type} on ${operation.protocol}: ${error.message}`,
            'error'
          );
        }
      }
      
      // Update status and result
      setStatus(results.success ? 'success' : 'partial');
      setResult(results);
      
      // Show final notification
      showNotification(
        results.success 
          ? `Strategy executed successfully! ${results.operations.length} operations completed.` 
          : `Strategy completed with ${results.failedOperations.length} failures out of ${operations.length} operations.`,
        results.success ? 'success' : 'warning'
      );
      
      return results;
    } catch (error) {
      console.error('Strategy execution failed:', error);
      
      setStatus('error');
      setError(error.message || 'Strategy execution failed');
      
      showNotification(`Strategy execution failed: ${error.message}`, 'error');
      throw error;
    } finally {
      setIsExecuting(false);
    }
  }, [executeTransaction, showNotification]);

  // Add a transaction to history (for tracking external transactions)
  const addTransaction = useCallback((transaction) => {
    setRecentTransactions(prev => [transaction, ...prev]);
  }, []);

  // Clear transaction history
  const clearTransactionHistory = useCallback(() => {
    setRecentTransactions([]);
    localStorage.removeItem('recentTransactions');
  }, []);

  return (
    <TransactionContext.Provider
      value={{
        pendingTransactions,
        recentTransactions,
        isExecuting,
        status,
        error,
        result,
        executeTransaction,
        executeStrategyTransaction,
        executeAIStrategy,
        addTransaction,
        clearTransactionHistory
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook to use the Transaction context
export const useTransactionContext = () => {
  const context = React.useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};