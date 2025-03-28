// src/services/transactionService.js - Transaction handling service for CompounDefi

import walletService from './walletService';
import { trackTransaction } from '../utils/analyticsUtils';
import storageService from './storageService';

/**
 * Class that handles blockchain transactions for CompounDefi
 * Provides transaction queue, retry, and notification capabilities
 */
class TransactionService {
  constructor() {
    this.transactionQueue = [];
    this.processingQueue = false;
    this.listeners = [];
    this.pendingTransactions = new Map();
    this.txHistoryCache = new Map();
    this.MAX_RETRIES = 3;
    this.TRANSACTION_TIMEOUT = 60000; // 60 seconds
    
    // Bind methods to maintain this context
    this.executeOperation = this.executeOperation.bind(this);
    this.executeStrategy = this.executeStrategy.bind(this);
    this.addTransactionToQueue = this.addTransactionToQueue.bind(this);
    this.processQueue = this.processQueue.bind(this);
    this.executeTransaction = this.executeTransaction.bind(this);
    this.waitForTransaction = this.waitForTransaction.bind(this);
    this.addTransactionListener = this.addTransactionListener.bind(this);
    this.removeTransactionListener = this.removeTransactionListener.bind(this);
    this.notifyListeners = this.notifyListeners.bind(this);
    this.getTransactionHistory = this.getTransactionHistory.bind(this);
    this.clearTransactionHistory = this.clearTransactionHistory.bind(this);
    this.storeTransactionInHistory = this.storeTransactionInHistory.bind(this);
  }

  /**
   * Execute a DeFi operation (stake, unstake, swap, etc.)
   * @param {string} protocol - Protocol name (e.g., 'amnis', 'thala')
   * @param {string} type - Operation type (e.g., 'stake', 'unstake', 'swap')
   * @param {string} amount - Amount to operate with
   * @param {string} contractAddress - Contract address to interact with
   * @param {string} functionName - Function name to call
   * @returns {Promise<Object>} Operation result
   */
  async executeOperation(protocol, type, amount, contractAddress, functionName) {
    if (!walletService.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    // Validate parameters
    if (!protocol) throw new Error('Protocol is required');
    if (!type) throw new Error('Operation type is required');
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      throw new Error('Valid amount is required');
    }
    if (!contractAddress) throw new Error('Contract address is required');
    if (!functionName) throw new Error('Function name is required');
    
    // Prepare operation object
    const operation = {
      protocol,
      type,
      amount: parseFloat(amount).toString(),
      contractAddress,
      functionName,
      timestamp: new Date().toISOString()
    };
    
    // Create transaction payload
    const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
    const transaction = {
      function: `${contractAddress}::${functionName}`,
      type_arguments: [],
      arguments: [amountInOctas]
    };
    
    // Execute transaction
    try {
      const transactionId = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const result = await this.addTransactionToQueue({
        id: transactionId,
        transaction,
        operation,
        retries: 0
      });
      
      // Track successful transaction
      trackTransaction(type, protocol, amount, true);
      
      return {
        success: true,
        operation,
        result,
        hash: result.hash || result.txHash || (result.transaction ? result.transaction.hash : null)
      };
    } catch (error) {
      // Track failed transaction
      trackTransaction(type, protocol, amount, false, error.message);
      
      throw error;
    }
  }

  /**
   * Execute multiple operations as part of a strategy
   * @param {Array} operations - Array of operations to execute
   * @returns {Promise<Object>} Strategy execution result
   */
  async executeStrategy(operations) {
    if (!walletService.isConnected()) {
      throw new Error('Wallet not connected');
    }
    
    if (!operations || !Array.isArray(operations) || operations.length === 0) {
      throw new Error('No operations to execute');
    }
    
    // Validate all operations first
    operations.forEach((op, index) => {
      if (!op.protocol) throw new Error(`Protocol is required for operation ${index}`);
      if (!op.type) throw new Error(`Type is required for operation ${index}`);
      if (!op.amount || isNaN(parseFloat(op.amount)) || parseFloat(op.amount) <= 0) {
        throw new Error(`Valid amount is required for operation ${index}`);
      }
      if (!op.contractAddress) throw new Error(`Contract address is required for operation ${index}`);
      if (!op.functionName) throw new Error(`Function name is required for operation ${index}`);
    });
    
    // Optimize operation order - execute withdrawals before deposits
    const orderedOperations = [
      ...operations.filter(op => ['unstake', 'withdraw', 'removeLiquidity'].includes(op.type)), 
      ...operations.filter(op => !['unstake', 'withdraw', 'removeLiquidity'].includes(op.type))
    ];
    
    // Results to track success/failure for each operation
    const results = { 
      success: true, 
      operations: [], 
      failedOperations: [], 
      totalOperations: operations.length 
    };
    
    // Execute operations sequentially
    for (const operation of orderedOperations) {
      try {
        // Pause briefly between operations to avoid rate limiting and improve UX
        if (results.operations.length > 0) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
        
        // Execute the operation
        const result = await this.executeOperation(
          operation.protocol, 
          operation.type, 
          operation.amount, 
          operation.contractAddress, 
          operation.functionName
        );
        
        // Store successful result
        results.operations.push({ 
          ...operation, 
          status: 'success', 
          result 
        });
      } catch (error) {
        // Store failed operation
        results.failedOperations.push({ 
          ...operation, 
          status: 'failed', 
          error: error.message 
        });
        
        // Mark overall strategy as failed
        results.success = false;
        
        // Continue with next operation instead of stopping the whole strategy
        console.error(`Operation failed but continuing with next operation:`, error);
      }
    }
    
    // Update summaries
    results.successfulOperations = results.operations.length;
    results.failedOperationsCount = results.failedOperations.length;
    results.timestamp = new Date().toISOString();
    
    // Store strategy execution in history
    this.storeTransactionInHistory({
      type: 'strategy',
      operations: orderedOperations.length,
      successfulOperations: results.operations.length,
      failedOperations: results.failedOperationsCount,
      timestamp: results.timestamp,
      success: results.success
    });
    
    return results;
  }

  /**
   * Add a transaction to the execution queue
   * @param {Object} transactionInfo - Transaction information
   * @returns {Promise<Object>} Transaction result
   */
  async addTransactionToQueue(transactionInfo) {
    return new Promise((resolve, reject) => {
      // Add to queue with resolve/reject callbacks
      this.transactionQueue.push({
        ...transactionInfo,
        resolve,
        reject
      });
      
      // Start processing queue if not already in progress
      if (!this.processingQueue) {
        this.processQueue();
      }
    });
  }

  /**
   * Process the transaction queue
   */
  async processQueue() {
    if (this.processingQueue || this.transactionQueue.length === 0) {
      return;
    }
    
    this.processingQueue = true;
    
    try {
      // Get next transaction from queue
      const txInfo = this.transactionQueue.shift();
      
      // Notify listeners about queue update
      this.notifyListeners({
        type: 'queue_update',
        queueLength: this.transactionQueue.length,
        processingTransaction: txInfo
      });
      
      try {
        // Execute the transaction
        const result = await this.executeTransaction(txInfo);
        
        // Store in transaction history
        this.storeTransactionInHistory({
          type: txInfo.operation.type,
          protocol: txInfo.operation.protocol,
          amount: txInfo.operation.amount,
          timestamp: new Date().toISOString(),
          hash: result.hash || result.txHash || (result.transaction ? result.transaction.hash : null),
          success: true
        });
        
        // Resolve the promise for this transaction
        txInfo.resolve(result);
      } catch (error) {
        // Handle retries
        if (txInfo.retries < this.MAX_RETRIES) {
          console.warn(`Transaction failed, retrying (${txInfo.retries + 1}/${this.MAX_RETRIES}):`, error);
          
          // Add back to queue with increased retry count
          this.transactionQueue.unshift({
            ...txInfo,
            retries: txInfo.retries + 1
          });
          
          // Notify listeners about retry
          this.notifyListeners({
            type: 'transaction_retry',
            transactionId: txInfo.id,
            retryCount: txInfo.retries + 1,
            error: error.message
          });
        } else {
          // Max retries reached, store failure in history
          this.storeTransactionInHistory({
            type: txInfo.operation.type,
            protocol: txInfo.operation.protocol,
            amount: txInfo.operation.amount,
            timestamp: new Date().toISOString(),
            error: error.message,
            success: false
          });
          
          // Reject the promise for this transaction
          txInfo.reject(error);
        }
      }
    } finally {
      // Mark queue as not processing
      this.processingQueue = false;
      
      // Continue with next transaction if any
      if (this.transactionQueue.length > 0) {
        this.processQueue();
      } else {
        // Notify listeners that queue is empty
        this.notifyListeners({
          type: 'queue_empty'
        });
      }
    }
  }

  /**
   * Execute a transaction with the wallet
   * @param {Object} txInfo - Transaction information
   * @returns {Promise<Object>} Transaction result
   */
  async executeTransaction(txInfo) {
    try {
      // Notify listeners that transaction is starting
      this.notifyListeners({
        type: 'transaction_started',
        transactionId: txInfo.id,
        operation: txInfo.operation
      });
      
      // Submit transaction using wallet service
      const result = await walletService.signAndSubmitTransaction(txInfo.transaction);
      
      // Add to pending transactions for status tracking
      const txHash = result.hash || result.txHash || (result.transaction ? result.transaction.hash : null);
      if (txHash) {
        this.pendingTransactions.set(txHash, {
          ...txInfo,
          hash: txHash,
          submittedAt: Date.now()
        });
        
        // Start tracking transaction status
        this.waitForTransaction(txHash);
      }
      
      // Notify listeners that transaction was submitted
      this.notifyListeners({
        type: 'transaction_submitted',
        transactionId: txInfo.id,
        hash: txHash,
        operation: txInfo.operation
      });
      
      return result;
    } catch (error) {
      // Notify listeners about transaction failure
      this.notifyListeners({
        type: 'transaction_failed',
        transactionId: txInfo.id,
        error: error.message,
        operation: txInfo.operation
      });
      
      throw error;
    }
  }

  /**
   * Wait for transaction to be confirmed
   * @param {string} txHash - Transaction hash
   */
  async waitForTransaction(txHash) {
    const pendingTx = this.pendingTransactions.get(txHash);
    if (!pendingTx) {
      return;
    }
    
    const timeoutId = setTimeout(() => {
      // Transaction timed out
      if (this.pendingTransactions.has(txHash)) {
        this.notifyListeners({
          type: 'transaction_timeout',
          hash: txHash,
          transactionId: pendingTx.id
        });
        
        this.pendingTransactions.delete(txHash);
      }
    }, this.TRANSACTION_TIMEOUT);
    
    try {
      // Start checking transaction status
      const txResult = await walletService.waitForTransaction(txHash);
      
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Transaction completed
      if (this.pendingTransactions.has(txHash)) {
        const isSuccessful = txResult.success || 
          (txResult.status && txResult.status === 'success') || 
          (txResult.data && txResult.data.success);
        
        this.notifyListeners({
          type: isSuccessful ? 'transaction_success' : 'transaction_failure',
          hash: txHash,
          transactionId: pendingTx.id,
          result: txResult
        });
        
        this.pendingTransactions.delete(txHash);
      }
    } catch (error) {
      // Clear timeout
      clearTimeout(timeoutId);
      
      // Transaction failed
      if (this.pendingTransactions.has(txHash)) {
        this.notifyListeners({
          type: 'transaction_error',
          hash: txHash,
          transactionId: pendingTx.id,
          error: error.message
        });
        
        this.pendingTransactions.delete(txHash);
      }
    }
  }

  /**
   * Add a transaction event listener
   * @param {Function} listener - Listener function
   */
  addTransactionListener(listener) {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  /**
   * Remove a transaction event listener
   * @param {Function} listener - Listener function to remove
   */
  removeTransactionListener(listener) {
    const index = this.listeners.indexOf(listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
  }

  /**
   * Notify all listeners about a transaction event
   * @param {Object} event - Event data
   */
  notifyListeners(event) {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (error) {
        console.error('Error in transaction listener:', error);
      }
    });
  }

  /**
   * Get transaction history
   * @param {number} limit - Maximum number of transactions to return
   * @returns {Array} Transaction history
   */
  getTransactionHistory(limit = 50) {
    // Load from storage if cache is empty
    if (this.txHistoryCache.size === 0) {
      const storedHistory = storageService.getItem('transactionHistory');
      if (storedHistory) {
        try {
          const parsedHistory = JSON.parse(storedHistory);
          if (Array.isArray(parsedHistory)) {
            // Convert to Map for caching
            parsedHistory.forEach(tx => {
              this.txHistoryCache.set(tx.id || `${tx.timestamp}-${Math.random()}`, tx);
            });
          }
        } catch (error) {
          console.error('Error parsing transaction history:', error);
        }
      }
    }
    
    // Get most recent transactions
    const transactions = Array.from(this.txHistoryCache.values())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return transactions;
  }

  // src/services/transactionService.js

/**
 * Transaction service for executing operations on the Aptos blockchain
 * This module handles the transaction lifecycle from construction to execution
 */

import { AptosClient, Types } from 'aptos';
import { showToast } from '../utils/animations';

// Constants for RPC URLs
const MAINNET_URL = 'https://fullnode.mainnet.aptoslabs.com/v1';
const TESTNET_URL = 'https://fullnode.testnet.aptoslabs.com/v1';

// Default options
const DEFAULT_OPTIONS = {
  network: 'mainnet',
  maxGasAmount: 5000,
  gasUnitPrice: 100,
  timeoutSecs: 30,
  maxRetries: 3
};

/**
 * Creates an Aptos client for the specified network
 * @param {string} network - 'mainnet' or 'testnet'
 * @returns {AptosClient} Aptos client instance
 */
const createClient = (network = 'mainnet') => {
  const nodeUrl = network === 'mainnet' ? MAINNET_URL : TESTNET_URL;
  return new AptosClient(nodeUrl);
};

/**
 * Execute a transaction using the connected wallet provider
 * @param {Object} walletProvider - Wallet provider (Petra, Martian, etc.)
 * @param {Object} transaction - Transaction payload
 * @param {Object} options - Transaction options
 * @returns {Promise<Object>} Transaction result
 */
export const executeTransaction = async (walletProvider, transaction, options = {}) => {
  try {
    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };
    const client = createClient(mergedOptions.network);
    
    // Ensure we have a wallet provider
    if (!walletProvider || !walletProvider.signAndSubmitTransaction) {
      throw new Error('No wallet provider available');
    }
    
    console.log('Executing transaction:', transaction);
    
    // Sign and submit the transaction
    const pendingTx = await walletProvider.signAndSubmitTransaction(transaction);
    console.log('Pending transaction:', pendingTx);
    
    // Wait for transaction to complete
    const txResult = await client.waitForTransaction(
      pendingTx.hash, 
      { timeoutSecs: mergedOptions.timeoutSecs }
    );
    
    console.log('Transaction result:', txResult);
    
    // Check transaction success
    if (txResult.success) {
      return {
        success: true,
        hash: pendingTx.hash,
        result: txResult,
        timestamp: new Date().toISOString()
      };
    } else {
      throw new Error(`Transaction failed: ${txResult.vm_status}`);
    }
  } catch (error) {
    console.error('Transaction execution error:', error);
    
    // Format the error for better user experience
    const errorMessage = formatTransactionError(error);
    
    return {
      success: false,
      error: errorMessage,
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Execute multiple transactions in sequence
 * @param {Object} walletProvider - Wallet provider
 * @param {Array} transactions - Array of transaction payloads
 * @param {Object} options - Transaction options
 * @param {Function} onProgress - Progress callback (index, result)
 * @returns {Promise<Object>} Combined transaction results
 */
export const executeTransactionBatch = async (walletProvider, transactions, options = {}, onProgress = null) => {
  const results = {
    success: true,
    operations: [],
    failedOperations: [],
    timestamp: new Date().toISOString()
  };
  
  for (let i = 0; i < transactions.length; i++) {
    try {
      // Execute each transaction
      const result = await executeTransaction(walletProvider, transactions[i], options);
      
      if (result.success) {
        results.operations.push({
          index: i,
          ...result
        });
      } else {
        results.failedOperations.push({
          index: i,
          ...result
        });
        results.success = false;
      }
      
      // Call progress callback if provided
      if (onProgress) {
        onProgress(i, result);
      }
    } catch (error) {
      console.error(`Error executing transaction at index ${i}:`, error);
      
      results.failedOperations.push({
        index: i,
        success: false,
        error: formatTransactionError(error),
        timestamp: new Date().toISOString()
      });
      
      results.success = false;
      
      // Call progress callback for the failure
      if (onProgress) {
        onProgress(i, { success: false, error: formatTransactionError(error) });
      }
    }
  }
  
  return results;
};

/**
 * Execute a strategy by converting it to a set of transactions
 * @param {Object} walletProvider - Wallet provider
 * @param {Array} operations - Strategy operations
 * @param {Object} options - Transaction options
 * @param {Function} onProgress - Progress callback
 * @returns {Promise<Object>} Execution results
 */
export const executeStrategy = async (walletProvider, operations, options = {}, onProgress = null) => {
  try {
    // Convert strategy operations to transaction payloads
    const transactions = operations.map(operation => {
      return buildTransactionPayload(operation);
    });
    
    // Execute the transaction batch
    return await executeTransactionBatch(walletProvider, transactions, options, onProgress);
  } catch (error) {
    console.error('Strategy execution error:', error);
    return {
      success: false,
      error: formatTransactionError(error),
      timestamp: new Date().toISOString()
    };
  }
};

/**
 * Build a transaction payload from an operation
 * @param {Object} operation - Operation details
 * @returns {Object} Transaction payload
 */
const buildTransactionPayload = (operation) => {
  // Extract operation details
  const { protocol, type, amount, contractAddress, functionName } = operation;
  
  // Convert amount to correct format (octas for APT)
  const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
  
  // Build the transaction payload
  const payload = {
    function: `${contractAddress}${functionName || getDefaultFunction(protocol, type)}`,
    type_arguments: [],
    arguments: [amountInOctas]
  };
  
  console.log('Built transaction payload:', payload);
  return payload;
};

/**
 * Get the default contract function based on protocol and operation type
 * @param {string} protocol - Protocol name
 * @param {string} type - Operation type
 * @returns {string} Contract function
 */
const getDefaultFunction = (protocol, type) => {
  const protocolLower = protocol.toLowerCase();
  const typeLower = type.toLowerCase();
  
  const functionMappings = {
    'amnis': { 
      'stake': '::staking::stake', 
      'unstake': '::staking::unstake', 
      'lend': '::lending::supply', 
      'withdraw': '::lending::withdraw', 
      'addLiquidity': '::router::add_liquidity', 
      'removeLiquidity': '::router::remove_liquidity' 
    },
    'thala': { 
      'stake': '::staking::stake_apt', 
      'unstake': '::staking::unstake_apt', 
      'lend': '::lending::supply_apt', 
      'withdraw': '::lending::withdraw_apt', 
      'addLiquidity': '::router::add_liquidity', 
      'removeLiquidity': '::router::remove_liquidity' 
    },
    'tortuga': { 
      'stake': '::staking::stake_apt', 
      'unstake': '::staking::unstake_apt' 
    },
    'ditto': { 
      'stake': '::staking::stake', 
      'unstake': '::staking::unstake' 
    }
  };

  // If we have a specific mapping for this protocol and operation type, use it
  if (functionMappings[protocolLower]?.[typeLower]) {
    return functionMappings[protocolLower][typeLower];
  }

  // Otherwise use general mappings
  switch (typeLower) {
    case 'stake': return '::staking::stake';
    case 'unstake': return '::staking::unstake';
    case 'lend': return '::lending::supply';
    case 'withdraw': return '::lending::withdraw';
    case 'addliquidity': return '::router::add_liquidity';
    case 'removeliquidity': return '::router::remove_liquidity';
    case 'deposit': return '::yield::deposit';
    default: return `::${typeLower}::execute`;
  }
};

/**
 * Format transaction errors for better user experience
 * @param {Error} error - The caught error
 * @returns {string} Formatted error message
 */
const formatTransactionError = (error) => {
  const errorMessage = error.message || String(error);
  
  // Check for common error patterns
  if (errorMessage.includes('user rejected')) {
    return 'Transaction was rejected by the user';
  }
  
  if (errorMessage.includes('insufficient funds')) {
    return 'Insufficient funds to complete this transaction';
  }
  
  if (errorMessage.includes('gas required exceeds')) {
    return 'Transaction requires more gas than allowed maximum';
  }
  
  if (errorMessage.includes('execution failure')) {
    // Try to extract the exact failure reason
    const match = errorMessage.match(/execution failure: (.+)/);
    if (match && match[1]) {
      return `Transaction failed: ${match[1]}`;
    }
  }
  
  // Return the original message if no specific pattern is matched
  return errorMessage;
};

/**
 * Estimate gas for a transaction
 * @param {string} network - Network to use
 * @param {Object} transaction - Transaction payload
 * @returns {Promise<Object>} Estimated gas
 */
export const estimateGas = async (network = 'mainnet', transaction) => {
  try {
    const client = createClient(network);
    // This is a placeholder - actual implementation depends on Aptos SDK
    // Aptos may not support gas estimation in the same way as EVM chains
    return { gasEstimate: DEFAULT_OPTIONS.maxGasAmount };
  } catch (error) {
    console.error('Gas estimation error:', error);
    return { gasEstimate: DEFAULT_OPTIONS.maxGasAmount };
  }
};

/**
 * Track transaction in analytics
 * @param {string} type - Transaction type
 * @param {string} protocol - Protocol name
 * @param {string} amount - Transaction amount
 * @param {boolean} success - Transaction success status
 * @param {string} error - Error message if failed
 */
export const trackTransaction = (type, protocol, amount, success, error = null) => {
  try {
    // Implement analytics tracking here
    console.log('Transaction tracked:', { type, protocol, amount, success, error });
    
    // Example analytics event
    if (window.analytics) {
      window.analytics.track('Transaction', {
        type,
        protocol,
        amount,
        success,
        error,
        timestamp: new Date().toISOString()
      });
    }
  } catch (e) {
    console.error('Error tracking transaction:', e);
  }
};

export default {
  executeTransaction,
  executeTransactionBatch,
  executeStrategy,
  estimateGas,
  trackTransaction
};

  /**
   * Clear transaction history
   */
  clearTransactionHistory() {
    this.txHistoryCache.clear();
    storageService.removeItem('transactionHistory');
  }

  /**
   * Store transaction in history
   * @param {Object} transaction - Transaction data to store
   */
  storeTransactionInHistory(transaction) {
    // Generate unique ID if not present
    const txId = transaction.id || 
      transaction.hash || 
      `${transaction.timestamp}-${Math.random().toString(36).substring(2, 9)}`;
    
    // Add to cache
    this.txHistoryCache.set(txId, {
      id: txId,
      ...transaction
    });
    
    // Keep cache limited to last 100 transactions
    if (this.txHistoryCache.size > 100) {
      const oldest = Array.from(this.txHistoryCache.entries())
        .sort(([, a], [, b]) => new Date(a.timestamp) - new Date(b.timestamp))
        [0][0];
      
      this.txHistoryCache.delete(oldest);
    }
    
    // Save to storage
    storageService.setItem(
      'transactionHistory', 
      JSON.stringify(Array.from(this.txHistoryCache.values()))
    );
  }
}

// Create singleton instance
const transactionService = new TransactionService();

export default transactionService;