// client/src/services/transactionService.js
// Service for handling blockchain transactions and interaction with the transaction_manager backend module

import api from './api';

/**
 * Service for handling transactions and operations on the Aptos blockchain
 */
const transactionService = {
  /**
   * Execute a single operation like staking, unstaking, etc.
   * @param {string} protocol - Protocol name
   * @param {string} type - Operation type (stake, unstake, addLiquidity, etc.)
   * @param {number|string} amount - Amount to operate with
   * @param {string} contractAddress - Contract address (optional)
   * @param {string} functionName - Function name to call (optional)
   * @returns {Promise<Object>} Transaction result
   */
  async executeOperation(protocol, type, amount, contractAddress, functionName) {
    try {
      const response = await api.post('/api/execute', {
        protocol,
        type,
        amount,
        contractAddress,
        functionName
      });
      return response.data;
    } catch (error) {
      console.error(`Error executing ${type} operation on ${protocol}:`, error);
      throw error;
    }
  },

  /**
   * Execute a series of operations as a strategy
   * @param {string} walletAddress - User's wallet address
   * @param {number|string} amount - Total investment amount
   * @param {Array} operations - Array of operations to execute
   * @returns {Promise<Object>} Strategy execution result
   */
  async executeStrategy(walletAddress, amount, operations) {
    try {
      const response = await api.post('/api/execute-strategy', {
        walletAddress,
        amount,
        operations
      });
      return response.data;
    } catch (error) {
      console.error('Error executing strategy:', error);
      throw error;
    }
  },

  /**
   * Execute a recommended strategy directly from AI recommendation
   * @param {string} walletAddress - User's wallet address
   * @param {Object} recommendation - AI recommendation object
   * @returns {Promise<Object>} Execution result
   */
  async executeRecommendation(walletAddress, recommendation) {
    try {
      // Extract operations from recommendation
      const operations = recommendation.allocation.map(item => ({
        protocol: item.protocol,
        type: this.determineOperationType(item.product),
        amount: item.amount,
        contractAddress: item.contractAddress
      }));

      return this.executeStrategy(walletAddress, recommendation.totalInvestment, operations);
    } catch (error) {
      console.error('Error executing recommendation:', error);
      throw error;
    }
  },

  /**
   * Simulate transaction to estimate gas and validate
   * @param {Object} transaction - Transaction payload
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Simulation result
   */
  async simulateTransaction(transaction, walletAddress) {
    try {
      const response = await api.post(`/api/wallet/${walletAddress}/simulate-transaction`, {
        transaction
      });
      return response.data;
    } catch (error) {
      console.error('Error simulating transaction:', error);
      throw error;
    }
  },

  /**
   * Execute auto-rebalance for a wallet
   * @param {string} walletAddress - User's wallet address
   * @param {boolean} force - Force rebalance even if below threshold
   * @returns {Promise<Object>} Rebalance result
   */
  async executeAutoRebalance(walletAddress, force = false) {
    try {
      const response = await api.post('/api/auto-rebalance/execute', {
        walletAddress,
        force
      });
      return response.data;
    } catch (error) {
      console.error('Error executing auto-rebalance:', error);
      throw error;
    }
  },

  /**
   * Update auto-rebalance settings for a wallet
   * @param {string} walletAddress - User's wallet address
   * @param {Object} settings - Rebalance settings
   * @returns {Promise<Object>} Updated settings
   */
  async updateAutoRebalanceSettings(walletAddress, settings) {
    try {
      const response = await api.post('/api/auto-rebalance/settings', {
        walletAddress,
        ...settings
      });
      return response.data;
    } catch (error) {
      console.error('Error updating auto-rebalance settings:', error);
      throw error;
    }
  },

  /**
   * Get auto-rebalance status for a wallet
   * @param {string} walletAddress - User's wallet address
   * @returns {Promise<Object>} Rebalance status
   */
  async getAutoRebalanceStatus(walletAddress) {
    try {
      const response = await api.get(`/api/auto-rebalance/status?walletAddress=${walletAddress}`);
      return response.data;
    } catch (error) {
      console.error('Error getting auto-rebalance status:', error);
      throw error;
    }
  },

  /**
   * Get transaction history for a wallet
   * @param {string} walletAddress - User's wallet address
   * @param {number} limit - Maximum number of transactions to return
   * @param {number} offset - Offset for pagination
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(walletAddress, limit = 20, offset = 0) {
    try {
      const response = await api.get(`/api/wallet/${walletAddress}/transactions?limit=${limit}&offset=${offset}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  },

  /**
   * Determine operation type based on product description
   * @param {string} product - Product description
   * @returns {string} Operation type
   */
  determineOperationType(product) {
    if (!product) return 'stake';
    
    const lowerProduct = product.toLowerCase();
    
    if (lowerProduct.includes('stake') || lowerProduct.includes('stapt') || lowerProduct.includes('apt') && lowerProduct.includes('st')) {
      return 'stake';
    }
    
    if (lowerProduct.includes('lend') || lowerProduct.includes('supply') || lowerProduct.includes('deposit')) {
      return 'lend';
    }
    
    if (lowerProduct.includes('liquidity') || lowerProduct.includes('pool') || lowerProduct.includes('swap')) {
      return 'addLiquidity';
    }
    
    if (lowerProduct.includes('yield') || lowerProduct.includes('farm') || lowerProduct.includes('vault')) {
      return 'deposit';
    }
    
    return 'stake'; // Default to staking
  },

  /**
   * Format transaction for display
   * @param {Object} transaction - Transaction data
   * @returns {Object} Formatted transaction
   */
  formatTransaction(transaction) {
    // Define type labels
    const typeLabels = {
      stake: 'Stake',
      unstake: 'Unstake',
      lend: 'Lend',
      withdraw: 'Withdraw',
      addLiquidity: 'Add Liquidity',
      removeLiquidity: 'Remove Liquidity',
      swap: 'Swap',
      other: 'Transaction'
    };

    // Format timestamp
    const timestamp = transaction.timestamp ? 
      new Date(transaction.timestamp).toLocaleString() : 
      'Unknown date';

    // Format status with appropriate label
    const statusLabels = {
      pending: 'Pending',
      completed: 'Completed',
      confirmed: 'Confirmed',
      failed: 'Failed'
    };

    return {
      ...transaction,
      formattedType: typeLabels[transaction.type] || typeLabels.other,
      formattedStatus: statusLabels[transaction.status] || transaction.status,
      formattedTimestamp: timestamp,
      shortHash: transaction.hash ? 
        `${transaction.hash.substring(0, 6)}...${transaction.hash.substring(62)}` : 
        null
    };
  }
};

export default transactionService;