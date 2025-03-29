// src/context/TransactionContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { useWalletContext } from './WalletContext';
import { useNotification } from './NotificationContext';
import { executeBatchTransactions } from '../services/transactionService';

// Create context
const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  // Transaction state
  const [pendingTransactions, setPendingTransactions] = useState([]);
  const [executingTransaction, setExecutingTransaction] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [executionStatus, setExecutionStatus] = useState(null);
  
  // Get wallet and notification context
  const { isConnected, executeTransaction } = useWalletContext();
  const { showNotification } = useNotification();
  
  // Load transaction history from localStorage on mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('transactionHistory');
    if (storedHistory) {
      try {
        setTransactionHistory(JSON.parse(storedHistory));
      } catch (error) {
        console.error('Failed to parse transaction history:', error);
      }
    }
  }, []);
  
  // Save transaction history to localStorage when it changes
  useEffect(() => {
    if (transactionHistory.length > 0) {
      localStorage.setItem('transactionHistory', JSON.stringify(transactionHistory));
    }
  }, [transactionHistory]);
  
  // Add transaction to queue
  const addTransaction = (transaction) => {
    setPendingTransactions(prevTransactions => [...prevTransactions, transaction]);
    return true;
  };
  
  // Add multiple transactions to queue
  const addTransactions = (transactions) => {
    setPendingTransactions(prevTransactions => [...prevTransactions, ...transactions]);
    return true;
  };
  
  // Clear transaction queue
  const clearTransactions = () => {
    setPendingTransactions([]);
    return true;
  };
  
  // Execute all pending transactions
  const executeTransactions = async () => {
    if (!isConnected) {
      showNotification('Wallet not connected', 'error');
      return false;
    }
    
    if (pendingTransactions.length === 0) {
      showNotification('No transactions to execute', 'warning');
      return false;
    }
    
    if (executingTransaction) {
      showNotification('Transaction execution in progress', 'warning');
      return false;
    }
    
    try {
      setExecutingTransaction(true);
      setExecutionStatus({
        status: 'executing',
        message: 'Executing transactions...',
        progress: 0
      });
      
      // Execute transactions
      const result = await executeTransactions(pendingTransactions);
      
      // Update transaction history
      const historyEntry = {
        id: Date.now().toString(),
        transactions: result.transactions,
        failedTransactions: result.failedTransactions,
        timestamp: Date.now(),
        success: result.success
      };
      
      setTransactionHistory(prevHistory => [historyEntry, ...prevHistory]);
      
      // Show notification
      if (result.success) {
        showNotification('All transactions executed successfully', 'success');
        setExecutionStatus({
          status: 'success',
          message: 'All transactions completed successfully',
          progress: 100
        });
      } else if (result.transactions.length > 0) {
        showNotification(`${result.transactions.length} transactions succeeded, ${result.failedTransactions.length} failed`, 'warning');
        setExecutionStatus({
          status: 'partial',
          message: `${result.transactions.length} succeeded, ${result.failedTransactions.length} failed`,
          progress: 100
        });
      } else {
        showNotification('All transactions failed', 'error');
        setExecutionStatus({
          status: 'failed',
          message: 'All transactions failed',
          progress: 100
        });
      }
      
      // Clear pending transactions
      setPendingTransactions([]);
      
      return result;
    } catch (error) {
      console.error('Transaction execution error:', error);
      showNotification(`Transaction execution failed: ${error.message}`, 'error');
      setExecutionStatus({
        status: 'failed',
        message: `Execution failed: ${error.message}`,
        progress: 100
      });
      return false;
    } finally {
      setExecutingTransaction(false);
    }
  };
  
  // Execute a single transaction
  const executeSingleTransaction = async (transaction) => {
    if (!isConnected) {
      showNotification('Wallet not connected', 'error');
      return false;
    }
    
    if (executingTransaction) {
      showNotification('Transaction execution in progress', 'warning');
      return false;
    }
    
    try {
      setExecutingTransaction(true);
      setExecutionStatus({
        status: 'executing',
        message: 'Executing transaction...',
        progress: 0
      });
      
      // Execute transaction
      const result = await executeTransaction(transaction);
      
      // Update transaction history
      const historyEntry = {
        id: Date.now().toString(),
        transactions: [{ ...transaction, result, status: 'success' }],
        failedTransactions: [],
        timestamp: Date.now(),
        success: true
      };
      
      setTransactionHistory(prevHistory => [historyEntry, ...prevHistory]);
      
      // Show notification
      showNotification('Transaction executed successfully', 'success');
      setExecutionStatus({
        status: 'success',
        message: 'Transaction completed successfully',
        progress: 100
      });
      
      return result;
    } catch (error) {
      console.error('Transaction execution error:', error);
      
      // Update transaction history with failed transaction
      const historyEntry = {
        id: Date.now().toString(),
        transactions: [],
        failedTransactions: [{ ...transaction, error: error.message, status: 'failed' }],
        timestamp: Date.now(),
        success: false
      };
      
      setTransactionHistory(prevHistory => [historyEntry, ...prevHistory]);
      
      showNotification(`Transaction failed: ${error.message}`, 'error');
      setExecutionStatus({
        status: 'failed',
        message: `Transaction failed: ${error.message}`,
        progress: 100
      });
      return false;
    } finally {
      setExecutingTransaction(false);
    }
  };
  
  // Execute a recommendation strategy
  const executeStrategy = async (recommendation) => {
    if (!isConnected) {
      showNotification('Wallet not connected', 'error');
      return false;
    }
    
    if (!recommendation || !recommendation.allocation) {
      showNotification('Invalid recommendation', 'error');
      return false;
    }
    
    if (executingTransaction) {
      showNotification('Transaction execution in progress', 'warning');
      return false;
    }
    
    try {
      setExecutingTransaction(true);
      setExecutionStatus({
        status: 'executing',
        message: 'Preparing strategy execution...',
        progress: 0
      });
      
      // Convert recommendation to transactions
      const transactions = prepareTransactionsFromRecommendation(recommendation);
      
      if (transactions.length === 0) {
        showNotification('No valid transactions in recommendation', 'error');
        return false;
      }
      
      // Execute transactions
      let currentProgress = 0;
      const progressStep = 100 / transactions.length;
      
      const results = {
        success: true,
        transactions: [],
        failedTransactions: []
      };
      
      for (let i = 0; i < transactions.length; i++) {
        const tx = transactions[i];
        
        setExecutionStatus({
          status: 'executing',
          message: `Executing transaction ${i + 1} of ${transactions.length}...`,
          progress: currentProgress
        });
        
        try {
          const result = await executeTransaction(tx);
          results.transactions.push({
            ...tx,
            result,
            status: 'success'
          });
        } catch (error) {
          console.error(`Transaction ${i + 1} failed:`, error);
          results.success = false;
          results.failedTransactions.push({
            ...tx,
            error: error.message,
            status: 'failed'
          });
          
          // Show failure notification
          showNotification(`Transaction ${i + 1} failed: ${error.message}`, 'error');
        }
        
        currentProgress += progressStep;
        setExecutionStatus({
          status: 'executing',
          message: `Completed transaction ${i + 1} of ${transactions.length}`,
          progress: currentProgress
        });
      }
      
      // Update transaction history
      const historyEntry = {
        id: Date.now().toString(),
        strategy: recommendation.title || 'AI Strategy',
        transactions: results.transactions,
        failedTransactions: results.failedTransactions,
        timestamp: Date.now(),
        success: results.success
      };
      
      setTransactionHistory(prevHistory => [historyEntry, ...prevHistory]);
      
      // Show notification
      if (results.success) {
        showNotification('Strategy executed successfully', 'success');
        setExecutionStatus({
          status: 'success',
          message: 'Strategy executed successfully',
          progress: 100
        });
      } else if (results.transactions.length > 0) {
        showNotification(`Strategy partially executed: ${results.transactions.length} succeeded, ${results.failedTransactions.length} failed`, 'warning');
        setExecutionStatus({
          status: 'partial',
          message: `Strategy partially executed: ${results.transactions.length} succeeded, ${results.failedTransactions.length} failed`,
          progress: 100
        });
      } else {
        showNotification('Strategy execution failed', 'error');
        setExecutionStatus({
          status: 'failed',
          message: 'Strategy execution failed',
          progress: 100
        });
      }
      
      return results;
    } catch (error) {
      console.error('Strategy execution error:', error);
      showNotification(`Strategy execution failed: ${error.message}`, 'error');
      setExecutionStatus({
        status: 'failed',
        message: `Strategy execution failed: ${error.message}`,
        progress: 100
      });
      return false;
    } finally {
      setExecutingTransaction(false);
    }
  };
  
  // Convert recommendation to transactions
  const prepareTransactionsFromRecommendation = (recommendation) => {
    if (!recommendation?.allocation) {
      return [];
    }
    
    // Get contract addresses from constants or environment
    const contractAddresses = {
      amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
      thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
      tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
      ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
      aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
      pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
      cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
    };
    
    // Map recommendation allocations to operations
    const operations = recommendation.allocation.map(item => {
      // Determine operation type based on product name
      const type = determineOperationType(item.product || item.protocol);
      
      // Get contract address (normalize protocol name to lowercase)
      const protocolLower = item.protocol.toLowerCase();
      const contractAddress = contractAddresses[protocolLower] || null;
      
      // Skip if no contract address found
      if (!contractAddress) {
        console.warn(`No contract address found for protocol: ${item.protocol}`);
        return null;
      }
      
      // Calculate amount if not explicitly provided
      const amount = item.amount || 
        ((parseFloat(recommendation.totalInvestment || 100) * parseFloat(item.percentage || 0) / 100).toFixed(2));
      
      // Skip if amount is invalid
      if (isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
        console.warn(`Invalid amount for ${item.protocol}: ${amount}`);
        return null;
      }
      
      return {
        protocol: item.protocol,
        type,
        amount,
        contractAddress,
        functionName: determineFunctionName(item.protocol, type),
        expectedApr: parseFloat(item.expectedApr || 0)
      };
    }).filter(Boolean); // Remove null items
    
    // Convert operations to transaction payloads
    return operations.map(operation => {
      const amountInOctas = Math.floor(parseFloat(operation.amount) * 100000000).toString();
      
      return {
        function: `${operation.contractAddress}${operation.functionName}`,
        type_arguments: [],
        arguments: [amountInOctas],
        metadata: {
          protocol: operation.protocol,
          type: operation.type,
          amount: operation.amount,
          expectedApr: operation.expectedApr
        }
      };
    });
  };
  
  /**
   * Determines the operation type based on product name
   */
  const determineOperationType = (product) => {
    if (!product) return 'stake';
    
    const lower = typeof product === 'string' ? product.toLowerCase() : '';
    
    if (lower.includes('stake') || lower.includes('apt')) {
      return 'stake';
    }
    if (lower.includes('lend') || lower.includes('supply')) {
      return 'lend';
    }
    if (lower.includes('liquidity') || lower.includes('pool')) {
      return 'addLiquidity';
    }
    if (lower.includes('vault') || lower.includes('yield')) {
      return 'deposit';
    }
    
    return 'stake'; // Default to staking
  };
  
  /**
   * Determines the appropriate function name based on protocol and operation type
   */
  const determineFunctionName = (protocol, operationType) => {
    const functionMappings = {
      'amnis': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake'
      },
      'thala': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt'
      },
      'tortuga': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt'
      },
      'ditto': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake'
      },
      'aries': { 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw'
      },
      'cetus': { 
        'addLiquidity': '::pool::add_liquidity', 
        'removeLiquidity': '::pool::remove_liquidity'
      },
      'pancakeswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity'
      }
    };

    const protocolLower = protocol.toLowerCase();
    const operationLower = operationType.toLowerCase();

    // If we have a specific mapping for this protocol and operation type, use it
    if (functionMappings[protocolLower]?.[operationLower]) {
      return functionMappings[protocolLower][operationLower];
    }

    // Otherwise use general mappings
    switch (operationLower) {
      case 'stake': return '::staking::stake';
      case 'unstake': return '::staking::unstake';
      case 'lend': return '::lending::supply';
      case 'withdraw': return '::lending::withdraw';
      case 'addliquidity': return '::router::add_liquidity';
      case 'removeliquidity': return '::router::remove_liquidity';
      case 'deposit': return '::yield::deposit';
      default: return `::${operationLower}::execute`;
    }
  };
  
  // Provider value
  const value = {
    pendingTransactions,
    executingTransaction,
    transactionHistory,
    executionStatus,
    addTransaction,
    addTransactions,
    clearTransactions,
    executeTransactions,
    executeSingleTransaction,
    executeStrategy
  };
  
  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
};

// Custom hook for using transaction context
export const useTransactionContext = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactionContext must be used within a TransactionProvider');
  }
  return context;
};

// Add this export at the end of the file:
export { TransactionContext };