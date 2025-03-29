// src/services/transactionService.js
import { useWalletContext } from '../context/WalletContext';
import { useNotification } from '../context/NotificationContext';

/**
 * Service to handle transaction execution for CompounDefi
 */

/**
 * Execute a transaction on the Aptos blockchain
 * @param {Object} transaction - Transaction payload
 * @param {string} transaction.function - Function to call (contract::module::function)
 * @param {Array} transaction.type_arguments - Type arguments for the function
 * @param {Array} transaction.arguments - Arguments for the function
 * @returns {Promise<Object>} - Transaction result
 */
export const executeTransaction = async (transaction, walletProvider) => {
  try {
    // Ensure transaction has required fields
    if (!transaction.function) {
      throw new Error('Transaction must include a function');
    }

    console.log('Executing transaction:', transaction);
    
    // Format transaction for Aptos
    const payload = {
      type: 'entry_function_payload',
      function: transaction.function,
      type_arguments: transaction.type_arguments || [],
      arguments: transaction.arguments || []
    };
    
    // Generate transaction through wallet
    const pendingTransaction = await walletProvider.generateTransaction(payload);
    
    // Sign and submit transaction
    const signedTx = await walletProvider.signTransaction(pendingTransaction);
    const submittedTx = await walletProvider.submitTransaction(signedTx);
    
    // Wait for transaction to complete
    console.log('Transaction submitted:', submittedTx.hash);
    
    // Poll for transaction status
    const txResult = await waitForTransactionCompletion(submittedTx.hash, walletProvider);
    
    return {
      success: true,
      hash: submittedTx.hash,
      ...txResult
    };
  } catch (error) {
    console.error('Transaction execution failed:', error);
    throw new Error(`Transaction failed: ${error.message}`);
  }
};

/**
 * Wait for transaction to complete
 * @param {string} txHash - Transaction hash
 * @param {Object} walletProvider - Wallet provider
 * @returns {Promise<Object>} - Transaction result
 */
const waitForTransactionCompletion = async (txHash, walletProvider) => {
  const maxAttempts = 20;
  const pollingInterval = 2000; // 2 seconds
  
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      const txInfo = await walletProvider.getTransaction(txHash);
      
      if (txInfo && txInfo.success) {
        return {
          status: 'success',
          info: txInfo
        };
      } else if (txInfo && !txInfo.success) {
        return {
          status: 'failed',
          error: txInfo.vm_status || 'Transaction failed',
          info: txInfo
        };
      }
      
      // Wait before polling again
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    } catch (error) {
      console.warn(`Error checking transaction status (attempt ${attempt + 1}):`, error);
      // Continue polling on error
      await new Promise(resolve => setTimeout(resolve, pollingInterval));
    }
  }
  
  // If we've reached here, transaction status is unknown
  return {
    status: 'unknown',
    message: 'Transaction status could not be determined'
  };
};

/**
 * Build a staking transaction
 * @param {string} protocol - Protocol identifier
 * @param {string} amount - Amount to stake in APT
 * @param {Object} contractAddresses - Contract addresses
 * @returns {Object} - Transaction payload
 */
export const buildStakingTransaction = (protocol, amount, contractAddresses) => {
  // Get contract address for protocol
  const contractAddress = contractAddresses[protocol.toLowerCase()];
  if (!contractAddress) {
    throw new Error(`Unknown protocol: ${protocol}`);
  }
  
  // Convert amount to octas (10^8)
  const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
  
  // Build transaction payload based on protocol
  switch (protocol.toLowerCase()) {
    case 'amnis':
      return {
        function: `${contractAddress}::staking::stake`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'thala':
      return {
        function: `${contractAddress}::staking::stake_apt`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'tortuga':
      return {
        function: `${contractAddress}::staking::stake_apt`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'ditto':
      return {
        function: `${contractAddress}::staking::stake`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    default:
      throw new Error(`Staking not supported for protocol: ${protocol}`);
  }
};

/**
 * Build an unstaking transaction
 * @param {string} protocol - Protocol identifier
 * @param {string} amount - Amount to unstake in liquid staking tokens
 * @param {Object} contractAddresses - Contract addresses
 * @returns {Object} - Transaction payload
 */
export const buildUnstakingTransaction = (protocol, amount, contractAddresses) => {
  // Get contract address for protocol
  const contractAddress = contractAddresses[protocol.toLowerCase()];
  if (!contractAddress) {
    throw new Error(`Unknown protocol: ${protocol}`);
  }
  
  // Convert amount to octas (10^8)
  const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
  
  // Build transaction payload based on protocol
  switch (protocol.toLowerCase()) {
    case 'amnis':
      return {
        function: `${contractAddress}::staking::unstake`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'thala':
      return {
        function: `${contractAddress}::staking::unstake_apt`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'tortuga':
      return {
        function: `${contractAddress}::staking::unstake_apt`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    case 'ditto':
      return {
        function: `${contractAddress}::staking::unstake`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
    default:
      throw new Error(`Unstaking not supported for protocol: ${protocol}`);
  }
};

/**
 * Build a liquidity provision transaction
 * @param {string} protocol - Protocol identifier (e.g., 'pancakeswap', 'cetus')
 * @param {string} tokenA - First token address
 * @param {string} tokenB - Second token address
 * @param {string} amountA - Amount of first token
 * @param {string} amountB - Amount of second token
 * @param {Object} contractAddresses - Contract addresses
 * @returns {Object} - Transaction payload
 */
export const buildLiquidityTransaction = (protocol, tokenA, tokenB, amountA, amountB, contractAddresses) => {
  // Get contract address for protocol
  const contractAddress = contractAddresses[protocol.toLowerCase()];
  if (!contractAddress) {
    throw new Error(`Unknown protocol: ${protocol}`);
  }
  
  // Convert amounts to octas (10^8)
  const amountAInOctas = Math.floor(parseFloat(amountA) * 100000000).toString();
  const amountBInOctas = Math.floor(parseFloat(amountB) * 100000000).toString();
  
  // Build transaction payload based on protocol
  switch (protocol.toLowerCase()) {
    case 'pancakeswap':
      return {
        function: `${contractAddress}::router::add_liquidity`,
        type_arguments: [tokenA, tokenB],
        arguments: [amountAInOctas, amountBInOctas, "0", "0"]
      };
    case 'cetus':
      return {
        function: `${contractAddress}::pool::add_liquidity`,
        type_arguments: [tokenA, tokenB],
        arguments: [amountAInOctas, amountBInOctas, "0", "0"]
      };
    default:
      throw new Error(`Liquidity provision not supported for protocol: ${protocol}`);
  }
};

/**
 * Build a lending transaction
 * @param {string} protocol - Protocol identifier
 * @param {string} asset - Asset to lend
 * @param {string} amount - Amount to lend
 * @param {Object} contractAddresses - Contract addresses
 * @returns {Object} - Transaction payload
 */
export const buildLendingTransaction = (protocol, asset, amount, contractAddresses) => {
  // Get contract address for protocol
  const contractAddress = contractAddresses[protocol.toLowerCase()];
  if (!contractAddress) {
    throw new Error(`Unknown protocol: ${protocol}`);
  }
  
  // Convert amount to octas (10^8)
  const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
  
  // Build transaction payload based on protocol
  switch (protocol.toLowerCase()) {
    case 'aries':
      return {
        function: `${contractAddress}::lending::supply`,
        type_arguments: [asset],
        arguments: [amountInOctas]
      };
    default:
      throw new Error(`Lending not supported for protocol: ${protocol}`);
  }
};

/**
 * Execute a batch of transactions
 * @param {Array} transactions - Array of transaction payloads
 * @param {Object} walletProvider - Wallet provider
 * @returns {Promise<Object>} - Batch execution result
 */
export const executeBatchTransactions = async (transactions, walletProvider) => {
  const results = {
    success: true,
    transactions: [],
    failedTransactions: []
  };
  
  for (const tx of transactions) {
    try {
      const result = await executeTransaction(tx, walletProvider);
      results.transactions.push({
        ...tx,
        result,
        status: 'success'
      });
    } catch (error) {
      results.success = false;
      results.failedTransactions.push({
        ...tx,
        error: error.message,
        status: 'failed'
      });
    }
  }
  
  return results;
};

// Export default contract addresses
export const CONTRACT_ADDRESSES = {
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
};