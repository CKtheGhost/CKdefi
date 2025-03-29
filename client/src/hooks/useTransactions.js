// src/hooks/useTransactions.js
import { useState, useEffect, useCallback, useContext } from 'react';
import axios from 'axios';
import { WalletContext } from '../context/WalletContext';
import { NotificationContext } from '../context/NotificationContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

/**
 * Hook for managing blockchain transactions and execution history
 * @returns {Object} Transaction methods and state
 */
const useTransactions = () => {
  const { account, signAndSubmitTransaction, network } = useContext(WalletContext);
  const { showNotification } = useContext(NotificationContext);
  
  const [transactions, setTransactions] = useState([]);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentTransaction, setCurrentTransaction] = useState(null);
  
  /**
   * Execute a single operation on a DeFi protocol
   * @param {Object} operation - Operation details
   * @returns {Promise<Object>} Transaction result
   */
  const executeOperation = useCallback(async (operation) => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      
      setIsLoading(true);
      setError(null);
      
      // Validate operation parameters
      if (!operation.protocol || !operation.type || !operation.amount) {
        throw new Error('Invalid operation: protocol, type, and amount are required');
      }
      
      // Get contract address if not provided
      if (!operation.contractAddress) {
        // Fetch contract address from server
        const contractsResponse = await axios.get(`${API_URL}/contracts`);
        const contracts = contractsResponse.data.contracts || {};
        operation.contractAddress = contracts[operation.protocol.toLowerCase()];
      }
      
      if (!operation.contractAddress) {
        throw new Error(`Contract address not found for protocol: ${operation.protocol}`);
      }
      
      // Simulate transaction first to check for errors
      const simulationResponse = await axios.post(`${API_URL}/wallet/${account.address}/simulate-transaction`, {
        transaction: {
          sender: account.address,
          function: operation.functionName 
            ? `${operation.contractAddress}${operation.functionName}`
            : `${operation.contractAddress}::${operation.type}::execute`,
          arguments: [
            // Convert APT amount to octas (APT * 10^8)
            (parseFloat(operation.amount) * 100000000).toString()
          ],
          type_arguments: operation.typeArguments || []
        }
      });
      
      if (!simulationResponse.data.success) {
        throw new Error(`Simulation failed: ${simulationResponse.data.vmStatus || 'Unknown error'}`);
      }
      
      // Create transaction payload
      const payload = {
        function: operation.functionName 
          ? `${operation.contractAddress}${operation.functionName}`
          : `${operation.contractAddress}::${operation.type}::execute`,
        type_arguments: operation.typeArguments || [],
        arguments: [
          // Convert APT amount to octas (APT * 10^8)
          (parseFloat(operation.amount) * 100000000).toString()
        ]
      };
      
      setCurrentTransaction({
        ...operation,
        status: 'signing',
        timestamp: new Date().toISOString()
      });
      
      // Sign and submit transaction
      const result = await signAndSubmitTransaction({
        sender: account.address,
        payload
      });
      
      const txHash = result.hash;
      
      // Update transaction status
      setCurrentTransaction(prev => ({
        ...prev,
        hash: txHash,
        status: 'pending'
      }));
      
      // Add to pending transactions
      const pendingTx = {
        hash: txHash,
        protocol: operation.protocol,
        type: operation.type,
        amount: operation.amount,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
      
      setPendingTransactions(prev => [...prev, pendingTx]);
      
      // Register transaction with server for tracking
      await axios.post(`${API_URL}/transactions/register`, {
        walletAddress: account.address,
        hash: txHash,
        protocol: operation.protocol,
        type: operation.type,
        amount: operation.amount,
        contractAddress: operation.contractAddress
      });
      
      // Start transaction monitoring
      monitorTransaction(txHash);
      
      // Show notification
      showNotification({
        type: 'info',
        title: 'Transaction Submitted',
        message: `Your ${operation.type} transaction on ${operation.protocol} has been submitted.`
      });
      
      return {
        success: true,
        hash: txHash,
        protocol: operation.protocol,
        type: operation.type,
        amount: operation.amount,
        status: 'pending',
        timestamp: new Date().toISOString()
      };
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      setError(errorMsg);
      
      showNotification({
        type: 'error',
        title: 'Transaction Failed',
        message: errorMsg
      });
      
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [account, signAndSubmitTransaction, showNotification]);
  
  /**
   * Execute multiple operations in sequence
   * @param {Array} operations - Array of operations to execute
   * @returns {Promise<Object>} Execution results
   */
  const executeOperations = useCallback(async (operations) => {
    if (!Array.isArray(operations) || operations.length === 0) {
      throw new Error('No operations provided');
    }
    
    if (!account?.address) {
      throw new Error('Wallet not connected');
    }
    
    const results = {
      operations: [],
      failedOperations: [],
      success: true
    };
    
    // Execute operations sequentially
    for (const operation of operations) {
      try {
        const result = await executeOperation(operation);
        results.operations.push(result);
      } catch (error) {
        results.failedOperations.push({
          ...operation,
          error: error.message
        });
        results.success = false;
        
        // Stop execution if a critical operation fails
        if (operation.critical) {
          break;
        }
      }
    }
    
    return results;
  }, [account, executeOperation]);
  
  /**
   * Monitor transaction status until confirmed
   * @param {string} txHash - Transaction hash to monitor
   * @returns {Promise<Object>} Final transaction status
   */
  const monitorTransaction = useCallback(async (txHash) => {
    try {
      // Initialize poll count
      let pollCount = 0;
      const maxPolls = 30; // Maximum number of status checks
      const pollInterval = 2000; // 2 seconds between checks
      
      const checkStatus = async () => {
        if (pollCount >= maxPolls) {
          updateTransactionStatus(txHash, 'timeout');
          return;
        }
        
        pollCount++;
        
        try {
          const response = await axios.get(`${API_URL}/transactions/${txHash}`);
          const status = response.data.status;
          
          // Update transaction status in state
          updateTransactionStatus(txHash, status);
          
          if (status === 'confirmed' || status === 'failed') {
            // Transaction is finalized, stop polling
            const finalStatus = status === 'confirmed' ? 'success' : 'failed';
            
            showNotification({
              type: finalStatus,
              title: `Transaction ${finalStatus === 'success' ? 'Successful' : 'Failed'}`,
              message: `Your transaction ${finalStatus === 'success' ? 'has been confirmed' : 'has failed'}.`
            });
            
            return;
          }
          
          // Continue polling
          setTimeout(checkStatus, pollInterval);
        } catch (err) {
          console.error('Error checking transaction status:', err);
          setTimeout(checkStatus, pollInterval);
        }
      };
      
      // Start polling
      await checkStatus();
    } catch (err) {
      console.error('Error monitoring transaction:', err);
    }
  }, [showNotification]);
  
  /**
   * Update transaction status in state
   * @param {string} txHash - Transaction hash
   * @param {string} status - New status
   */
  const updateTransactionStatus = useCallback((txHash, status) => {
    // Update pending transactions
    setPendingTransactions(prev => 
      prev.map(tx => 
        tx.hash === txHash 
          ? { ...tx, status } 
          : tx
      ).filter(tx => tx.status === 'pending' || Date.now() - new Date(tx.timestamp).getTime() < 24 * 60 * 60 * 1000)
    );
    
    // Update current transaction if it matches
    setCurrentTransaction(prev => 
      prev && prev.hash === txHash 
        ? { ...prev, status } 
        : prev
    );
    
    // Update transaction history
    setTransactionHistory(prev => {
      const existingIndex = prev.findIndex(tx => tx.hash === txHash);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = { ...updated[existingIndex], status };
        return updated;
      }
      return prev;
    });
  }, []);
  
  /**
   * Fetch transaction history for the connected wallet
   * @param {number} limit - Number of transactions to fetch
   * @returns {Promise<Array>} Transaction history
   */
  const getTransactionHistory = useCallback(async (limit = 20) => {
    try {
      if (!account?.address) {
        return [];
      }
      
      setIsLoading(true);
      
      const response = await axios.get(`${API_URL}/wallet/${account.address}/transactions`, {
        params: { limit }
      });
      
      const history = response.data.transactions || [];
      setTransactionHistory(history);
      
      return history;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [account]);
  
  /**
   * Simulate a transaction before execution
   * @param {Object} transaction - Transaction to simulate
   * @returns {Promise<Object>} Simulation result
   */
  const simulateTransaction = useCallback(async (transaction) => {
    try {
      if (!account?.address) {
        throw new Error('Wallet not connected');
      }
      
      const response = await axios.post(`${API_URL}/wallet/${account.address}/simulate-transaction`, {
        transaction
      });
      
      return response.data;
    } catch (err) {
      setError(err.response?.data?.error || err.message);
      throw err;
    }
  }, [account]);
  
  /**
   * Get block explorer URL for a transaction
   * @param {string} txHash - Transaction hash
   * @returns {string} Block explorer URL
   */
  const getExplorerUrl = useCallback((txHash) => {
    if (!txHash) return '';
    
    const explorerBaseUrl = network === 'testnet' 
      ? 'https://explorer.aptoslabs.com/txn/' 
      : 'https://explorer.aptoslabs.com/txn/';
    
    return `${explorerBaseUrl}${txHash}`;
  }, [network]);
  
  // Effect to fetch transaction history when wallet is connected
  useEffect(() => {
    if (account?.address) {
      getTransactionHistory()
        .catch(err => console.error('Failed to load transaction history:', err));
    }
  }, [account, getTransactionHistory]);
  
  return {
    // State
    transactions,
    transactionHistory,
    pendingTransactions,
    isLoading,
    error,
    currentTransaction,
    
    // Methods
    executeOperation,
    executeOperations,
    monitorTransaction,
    getTransactionHistory,
    simulateTransaction,
    getExplorerUrl,
    
    // Helpers
    clearError: () => setError(null)
  };
};

export default useTransactions;