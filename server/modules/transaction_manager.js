// modules/transaction_manager.js - Transaction management for CompounDefi
const { Aptos, AptosConfig, Network, Types } = require('@aptos-labs/ts-sdk');

/**
 * Transaction Manager Module - Handles transaction preparation, submission, and tracking
 * for the CompounDefi platform.
 */
class TransactionManager {
  constructor(config = {}) {
    this.aptosClient = null;
    this.pendingTransactions = {};
    this.transactionHistory = [];
    this.initialized = false;
    this.network = config.network || Network.MAINNET;
    this.rpcEndpoint = config.rpcEndpoint || null;
    this.transactionCallbacks = {
      onStart: null,
      onSubmit: null,
      onSuccess: null,
      onFail: null
    };
    this.contractAddresses = {
      // Liquid Staking Protocols
      amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
      thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
      tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
      ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
      
      // Lending/Borrowing Protocols
      aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
      echelon: "0xf8197c9fa1a397568a47b7a6c5a9b09fa97c8f29f9dcc347232c22e3b24b1f09",
      echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
      
      // DEXes and AMMs
      pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
      liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
      cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
    };
  }

  /**
   * Initialize the transaction manager
   * @param {Object} options - Initialization options
   * @returns {Promise<boolean>} Success status
   */
  async initialize(options = {}) {
    try {
      if (this.initialized) {
        console.log('Transaction manager already initialized');
        return true;
      }

      // Configure Aptos client
      const networkConfig = options.network || this.network;
      const endpoint = options.rpcEndpoint || this.rpcEndpoint;
      
      const aptosConfig = new AptosConfig({
        network: networkConfig,
        ...(endpoint && { clientConfig: { FULLNODE_URL: endpoint } })
      });
      
      this.aptosClient = new Aptos(aptosConfig);
      
      // Test connection
      await this.aptosClient.getLedgerInfo();
      
      // Set contract addresses from options if provided
      if (options.contractAddresses) {
        this.contractAddresses = {
          ...this.contractAddresses,
          ...options.contractAddresses
        };
      }
      
      // Load transaction history from storage if provided
      if (options.loadHistory && typeof options.loadHistory === 'function') {
        const history = await options.loadHistory();
        if (Array.isArray(history)) {
          this.transactionHistory = history;
        }
      }
      
      this.initialized = true;
      console.log(`Transaction manager initialized on ${networkConfig}`);
      return true;
    } catch (error) {
      console.error('Failed to initialize transaction manager:', error);
      // Try to create a minimal client for some functionality
      try {
        const fallbackConfig = new AptosConfig({ network: Network.MAINNET });
        this.aptosClient = new Aptos(fallbackConfig);
        console.warn('Using fallback Aptos configuration');
      } catch (fallbackError) {
        console.error('Fallback configuration also failed:', fallbackError);
      }
      return false;
    }
  }

  /**
   * Set callback functions for transaction lifecycle events
   * @param {Object} callbacks - Callback functions
   */
  setTransactionCallbacks(callbacks = {}) {
    if (callbacks.onStart && typeof callbacks.onStart === 'function') {
      this.transactionCallbacks.onStart = callbacks.onStart;
    }
    
    if (callbacks.onSubmit && typeof callbacks.onSubmit === 'function') {
      this.transactionCallbacks.onSubmit = callbacks.onSubmit;
    }
    
    if (callbacks.onSuccess && typeof callbacks.onSuccess === 'function') {
      this.transactionCallbacks.onSuccess = callbacks.onSuccess;
    }
    
    if (callbacks.onFail && typeof callbacks.onFail === 'function') {
      this.transactionCallbacks.onFail = callbacks.onFail;
    }
  }

  /**
   * Execute a single operation on a DeFi protocol
   * @param {string} protocol - Protocol name
   * @param {string} type - Operation type (e.g., stake, unstake)
   * @param {string} amount - Amount to operate with
   * @param {string} contractAddress - Contract address (optional)
   * @param {string} functionName - Function name to call (optional)
   * @returns {Promise<Object>} Transaction result
   */
  async executeOperation(protocol, type, amount, contractAddress, functionName) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      // Validate inputs
      if (!protocol || !type || !amount) {
        throw new Error('Protocol, type, and amount are required');
      }
      
      // Parse amount and ensure it's positive
      const parsedAmount = parseFloat(amount);
      if (isNaN(parsedAmount) || parsedAmount <= 0) {
        throw new Error(`Invalid amount: ${amount}`);
      }
      
      // Resolve contract address if not provided
      if (!contractAddress) {
        contractAddress = this.contractAddresses[protocol.toLowerCase()];
        if (!contractAddress) {
          throw new Error(`No contract address found for protocol: ${protocol}`);
        }
      }
      
      // Determine function name if not provided
      if (!functionName) {
        functionName = this.determineFunctionName(protocol, type);
      }
      
      // Create transaction ID
      const txId = `${Date.now()}-${protocol}-${type}`;
      
      // Call onStart callback if provided
      if (this.transactionCallbacks.onStart) {
        this.transactionCallbacks.onStart({
          txId,
          protocol,
          type,
          amount: parsedAmount.toString(),
          contractAddress,
          functionName
        });
      }
      
      // Convert APT to Octas (APT * 10^8)
      const amountInOctas = BigInt(Math.floor(parsedAmount * 100000000));
      
      // Prepare transaction payload
      const payload = {
        function: `${contractAddress}${functionName}`,
        type_arguments: [],
        arguments: [amountInOctas.toString()]
      };
      
      console.log(`Executing ${type} operation on ${protocol} for ${amount} APT`);
      console.log('Function:', `${contractAddress}${functionName}`);
      
      // This would normally use the wallet adapter to sign and submit the transaction
      // Since we're in a Node.js environment without browser wallet access,
      // this is a placeholder that would be replaced in the frontend implementation
      
      // Simulate success for testing purposes
      const result = {
        success: true,
        txId,
        hash: `0x${Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('')}`,
        protocol,
        type,
        amount: parsedAmount.toString(),
        timestamp: new Date().toISOString()
      };
      
      // Add to transaction history
      this.addToTransactionHistory({
        txId,
        hash: result.hash,
        protocol,
        type,
        amount: parsedAmount.toString(),
        contractAddress,
        functionName,
        status: 'confirmed',
        timestamp: result.timestamp
      });
      
      // Call onSuccess callback if provided
      if (this.transactionCallbacks.onSuccess) {
        this.transactionCallbacks.onSuccess(result);
      }
      
      return result;
    } catch (error) {
      console.error(`Error executing ${type} operation on ${protocol}:`, error);
      
      // Call onFail callback if provided
      if (this.transactionCallbacks.onFail) {
        this.transactionCallbacks.onFail({
          protocol,
          type,
          amount,
          error: error.message
        });
      }
      
      return {
        success: false,
        error: error.message,
        protocol,
        type,
        amount
      };
    }
  }

  /**
   * Execute a series of operations as a strategy
   * @param {Array} operations - Array of operations to execute
   * @returns {Promise<Object>} Strategy execution result
   */
  async executeStrategy(operations) {
    if (!Array.isArray(operations) || operations.length === 0) {
      return { success: false, error: 'No operations to execute' };
    }
    
    const results = {
      operations: [],
      failedOperations: [],
      success: true,
      startTime: new Date().toISOString()
    };
    
    // Optimize operation order (withdrawals first, then deposits)
    const orderedOperations = this.optimizeOperationOrder(operations);
    
    // Execute operations sequentially
    for (const operation of orderedOperations) {
      try {
        const result = await this.executeOperation(
          operation.protocol,
          operation.type,
          operation.amount,
          operation.contractAddress,
          operation.functionName
        );
        
        if (result.success) {
          results.operations.push({ ...operation, result });
        } else {
          results.failedOperations.push({ ...operation, error: result.error });
          // If a critical operation fails, we might want to abort the strategy
          if (operation.critical) {
            results.success = false;
            results.error = `Critical operation failed: ${result.error}`;
            break;
          }
        }
      } catch (error) {
        results.failedOperations.push({ ...operation, error: error.message });
        // Continue with other operations unless this was critical
        if (operation.critical) {
          results.success = false;
          results.error = `Critical operation failed: ${error.message}`;
          break;
        }
      }
      
      // Short delay between operations
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    // Set overall success status based on failures
    results.success = results.failedOperations.length === 0;
    results.endTime = new Date().toISOString();
    
    return results;
  }

  /**
   * Optimize the order of operations for efficient execution
   * @param {Array} operations - Operations to optimize
   * @returns {Array} Ordered operations
   */
  optimizeOperationOrder(operations) {
    if (!operations || operations.length <= 1) return operations;
    
    // First do all operations that free up APT (unstake, withdraw, removeLiquidity)
    // Then do all operations that use APT (stake, lend, addLiquidity)
    const withdrawTypes = ['unstake', 'withdraw', 'removeliquidity'];
    
    const withdrawOps = operations
      .filter(op => withdrawTypes.includes(op.type.toLowerCase()))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      
    const addOps = operations
      .filter(op => !withdrawTypes.includes(op.type.toLowerCase()))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    return [...withdrawOps, ...addOps];
  }

  /**
   * Determine function name for a protocol and operation type
   * @param {string} protocol - Protocol name
   * @param {string} operationType - Operation type
   * @returns {string} Function name
   */
  determineFunctionName(protocol, operationType) {
    const protocolLower = protocol.toLowerCase();
    const opTypeLower = operationType.toLowerCase();
    
    // Protocol-specific function mappings
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
      'echo': { 
        'lend': '::lending::supply',
        'withdraw': '::lending::withdraw' 
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
        'removeLiquidity': '::pool::remove_liquidity',
        'swap': '::pool::swap'
      },
      'pancakeswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
      },
      'liquidswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
      }
    };
    
    // Check for protocol-specific function name
    if (functionMappings[protocolLower] && functionMappings[protocolLower][opTypeLower]) {
      return functionMappings[protocolLower][opTypeLower];
    }
    
    // Default function names by operation type
    switch (opTypeLower) {
      case 'stake': return '::staking::stake';
      case 'unstake': return '::staking::unstake';
      case 'lend': return '::lending::supply';
      case 'withdraw': return '::lending::withdraw';
      case 'addliquidity': return '::router::add_liquidity';
      case 'removeliquidity': return '::router::remove_liquidity';
      case 'swap': return '::router::swap_exact_input';
      default: return `::${opTypeLower}::execute`;
    }
  }

  /**
   * Check transaction status
   * @param {string} txHash - Transaction hash
   * @returns {Promise<Object>} Transaction status
   */
  async checkTransactionStatus(txHash) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      if (!txHash || !txHash.startsWith('0x')) {
        throw new Error('Invalid transaction hash');
      }
      
      const txInfo = await this.aptosClient.getTransactionByHash(txHash);
      
      return {
        hash: txHash,
        status: txInfo.success ? 'confirmed' : 'failed',
        success: txInfo.success,
        vmStatus: txInfo.vm_status,
        gasUsed: txInfo.gas_used,
        timestamp: txInfo.timestamp,
        version: txInfo.version
      };
    } catch (error) {
      console.error(`Error checking transaction status for ${txHash}:`, error);
      return {
        hash: txHash,
        status: 'unknown',
        error: error.message
      };
    }
  }

  /**
   * Add transaction to history
   * @param {Object} transaction - Transaction data
   */
  addToTransactionHistory(transaction) {
    if (!transaction || !transaction.txId) return;
    
    // Add transaction to history
    this.transactionHistory.unshift(transaction);
    
    // Limit history size to 100 transactions
    if (this.transactionHistory.length > 100) {
      this.transactionHistory = this.transactionHistory.slice(0, 100);
    }
  }

  /**
   * Get transaction history for an address
   * @param {string} address - Wallet address
   * @param {number} limit - Maximum number of transactions to return
   * @returns {Promise<Array>} Transaction history
   */
  async getTransactionHistory(address, limit = 20) {
    try {
      if (!this.initialized) {
        await this.initialize();
      }
      
      if (!address || !address.startsWith('0x')) {
        throw new Error('Invalid wallet address');
      }
      
      // Get transactions from Aptos indexer
      const response = await this.aptosClient.getAccountTransactions({
        accountAddress: address,
        limit
      });
      
      // Transform to standardized format
      return response.map(tx => ({
        hash: tx.hash,
        sender: tx.sender,
        success: tx.success,
        timestamp: tx.timestamp,
        type: this.getTransactionType(tx),
        version: tx.version,
        vmStatus: tx.vm_status,
        gasUsed: tx.gas_used
      }));
    } catch (error) {
      console.error(`Error fetching transaction history for ${address}:`, error);
      // Return local history as fallback
      return this.transactionHistory.filter(tx => 
        tx.sender === address || tx.receiver === address
      ).slice(0, limit);
    }
  }

  /**
   * Determine transaction type from transaction data
   * @param {Object} tx - Transaction data
   * @returns {string} Transaction type
   */
  getTransactionType(tx) {
    if (!tx.payload || !tx.payload.function) return 'unknown';
    
    const functionName = tx.payload.function;
    
    if (functionName.includes('::staking::stake')) {
      return 'stake';
    } else if (functionName.includes('::staking::unstake')) {
      return 'unstake';
    } else if (functionName.includes('::lending::supply') || functionName.includes('::lending::deposit')) {
      return 'lend';
    } else if (functionName.includes('::lending::withdraw')) {
      return 'withdraw';
    } else if (functionName.includes('::router::add_liquidity') || functionName.includes('::pool::add_liquidity')) {
      return 'addLiquidity';
    } else if (functionName.includes('::router::remove_liquidity') || functionName.includes('::pool::remove_liquidity')) {
      return 'removeLiquidity';
    } else if (functionName.includes('::router::swap') || functionName.includes('::pool::swap')) {
      return 'swap';
    } else if (functionName.includes('::coin::transfer')) {
      return 'transfer';
    } else {
      return 'other';
    }
  }

  /**
   * Prepare operations from a recommendation
   * @param {Object} recommendation - AI recommendation
   * @returns {Array} Operations to execute
   */
  prepareOperationsFromRecommendation(recommendation) {
    if (!recommendation || !recommendation.allocation) {
      return [];
    }
    
    return recommendation.allocation.map(item => {
      // Determine operation type from product description
      const type = this.determineOperationType(item.product);
      
      // Get contract address for this protocol
      const contractAddress = this.contractAddresses[item.protocol.toLowerCase()];
      
      // Get function name for this protocol and operation type
      const functionName = this.determineFunctionName(item.protocol, type);
      
      // Get amount
      const amount = item.amount || (
        (parseFloat(recommendation.totalInvestment || 0) * parseFloat(item.percentage) / 100).toFixed(2)
      );
      
      return {
        protocol: item.protocol,
        type,
        amount,
        contractAddress,
        functionName,
        expectedApr: parseFloat(item.expectedApr || 0)
      };
    }).filter(op => {
      // Filter out invalid operations
      if (!op.contractAddress) {
        console.warn(`No contract address for protocol: ${op.protocol}`);
        return false;
      }
      
      if (isNaN(parseFloat(op.amount)) || parseFloat(op.amount) <= 0) {
        console.warn(`Invalid amount for ${op.protocol}: ${op.amount}`);
        return false;
      }
      
      return true;
    });
  }

  /**
   * Determine operation type from product description
   * @param {string} product - Product description
   * @returns {string} Operation type
   */
  determineOperationType(product) {
    if (!product) return 'stake';
    
    const lower = product.toLowerCase();
    
    if (lower.includes('stake') || lower.includes('stapt') || lower.includes('apt') && lower.includes('st')) {
      return 'stake';
    } else if (lower.includes('lend') || lower.includes('lending') || lower.includes('supply')) {
      return 'lend';
    } else if (lower.includes('liquidity') || lower.includes('amm') || lower.includes('pool')) {
      return 'addLiquidity';
    } else if (lower.includes('swap')) {
      return 'swap';
    } else {
      return 'stake'; // Default to staking
    }
  }
}

module.exports = new TransactionManager();