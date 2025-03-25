// transactionService.js - Transaction handling service for CompounDefi

import walletService from './walletService';
import { trackTransaction } from '../utils/analyticsUtils';

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
      function: `${contractAddress}${functionName}`,
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
        hash: result.hash || result.txHash || result.transaction?.hash
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
    results.failedOperations = results.failedOperations.length;
    results.timestamp = new Date().toISOString();
    
    // Store strategy execution in history
    this.storeTransactionInHistory({
      type: 'strategy',
      operations: orderedOperations.length,
      successfulOperations: results.operations.length,
      failedOperations: results.failedOperations.length,
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
          hash: result.hash || result.txHash || result.transaction?.hash,
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
      if (result.hash || result.txHash || result.transaction?.hash) {
        const txHash = result.hash || result.txHash || result.transaction?.hash;
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
        hash: result.hash || result.txHash || result.transaction?.hash
      });
      
      return result;
    } catch (error) {
      // Notify listeners about transaction failure
      this.notifyListeners({
        type: 'transaction_failed',
        transactionId: txInfo.id,
        error: error.message
      });
      
      throw error;
    }
  }

  /**
   * Wait for a transaction to complete
   * @param {string} txHash - Transaction hash
   */
  async waitForTransaction(txHash) {
    const txInfo = this.pendingTransactions.get(txHash);
    if (!txInfo) return;
    
    try {
      // Set timeout for transaction
      const timeoutId = setTimeout(() => {
        this.pendingTransactions.delete(txHash);
        this.notifyListeners({
          type: 'transaction_timeout',
          hash: txHash
        });
      }, this.TRANSACTION_TIMEOUT);
      
      // Start polling for transaction status
      let confirmed = false;
      const startTime = Date.now();
      
      while (!confirmed && Date.now() - startTime < this.TRANSACTION_TIMEOUT) {
        try {
          // Use appropriate wallet provider to check transaction status
          const provider = window[walletService.getWalletProvider()];
          
          if (provider && typeof provider.getTransaction === 'function') {
            const txStatus = await provider.getTransaction(txHash);
            
            if (txStatus && txStatus.success !== undefined) {
              confirmed = true;
              
              // Remove from pending transactions
              this.pendingTransactions.delete(txHash);
              clearTimeout(timeoutId);
              
              // Notify listeners about transaction completion
              this.notifyListeners({
                type: 'transaction_confirmed',
                hash: txHash,
                success: txStatus.success,
                status: txStatus
              });
            }
          } else {
            // If provider doesn't support status checking, just wait a bit
            // and assume it succeeded
            await new Promise(resolve => setTimeout(resolve, 10000));
            confirmed = true;
            this.pendingTransactions.delete(txHash);
            clearTimeout(timeoutId);
          }
        } catch (error) {
          console.warn(`Error checking transaction status (will retry): ${error.message}`);
        }
        
        // Wait before next check
        if (!confirmed) {
          await new Promise(resolve => setTimeout(resolve, 3000));
        }
      }
    } catch (error) {
      console.error(`Error waiting for transaction ${txHash}:`, error);
      this.pendingTransactions.delete(txHash);
    }
  }

  /**
   * Store a transaction in the history
   * @param {Object} transaction - Transaction details
   */
  storeTransactionInHistory(transaction) {
    // Get wallet address to use as key
    const walletAddress = walletService.getWalletAddress();
    if (!walletAddress) return;
    
    // Get existing history for this wallet
    let history = this.txHistoryCache.get(walletAddress) || [];
    
    // Add transaction to history
    history = [transaction, ...history].slice(0, 50); // Keep only latest 50 transactions
    
    // Store in cache
    this.txHistoryCache.set(walletAddress, history);
    
    // Notify listeners
    this.notifyListeners({
      type: 'history_updated',
      walletAddress,
      history
    });
  }

  /**
   * Get transaction history for a wallet
   * @param {string} walletAddress - Wallet address
   * @returns {Array} Transaction history
   */
  getTransactionHistory(walletAddress = null) {
    const address = walletAddress || walletService.getWalletAddress();
    if (!address) return [];
    
    return this.txHistoryCache.get(address) || [];
  }

  /**
   * Clear transaction history for a wallet
   * @param {string} walletAddress - Wallet address
   */
  clearTransactionHistory(walletAddress = null) {
    const address = walletAddress || walletService.getWalletAddress();
    if (!address) return;
    
    this.txHistoryCache.delete(address);
    
    // Notify listeners
    this.notifyListeners({
      type: 'history_updated',
      walletAddress: address,
      history: []
    });
  }

  /**
   * Add a transaction listener
   * @param {Function} listener - Listener function
   */
  addTransactionListener(listener) {
    if (typeof listener === 'function' && !this.listeners.includes(listener)) {
      this.listeners.push(listener);
    }
  }

  /**
   * Remove a transaction listener
   * @param {Function} listener - Listener function to remove
   */
  removeTransactionListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  /**
   * Notify all transaction listeners
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
   * Get pending transactions
   * @returns {Array} Pending transactions
   */
  getPendingTransactions() {
    return Array.from(this.pendingTransactions.values());
  }

  /**
   * Get transaction queue length
   * @returns {number} Queue length
   */
  getQueueLength() {
    return this.transactionQueue.length;
  }

  /**
   * Check if a transaction is pending
   * @param {string} txHash - Transaction hash
   * @returns {boolean} Whether transaction is pending
   */
  isTransactionPending(txHash) {
    return this.pendingTransactions.has(txHash);
  }
}

// Create singleton instance
const transactionService = new TransactionService();

export default transactionService;