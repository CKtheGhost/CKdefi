import { useState, useEffect, useContext, useCallback } from 'react';
import { NotificationContext } from '../context/NotificationContext';
import { WalletContext } from '../context/WalletContext';
import { TransactionContext } from '../context/TransactionContext';

/**
 * Custom hook for handling blockchain transactions
 * Manages transaction lifecycle from preparation to confirmation
 */
const useTransactions = () => {
  const { setNotification } = useContext(NotificationContext);
  const { walletAddress, walletProvider, networkType } = useContext(WalletContext);
  const { addTransaction, updateTransaction, transactions } = useContext(TransactionContext);
  
  // Transaction execution state
  const [executing, setExecuting] = useState(false);
  const [currentTxId, setCurrentTxId] = useState(null);
  const [txProgress, setTxProgress] = useState(0);
  const [txStatus, setTxStatus] = useState(null);
  const [abortController, setAbortController] = useState(null);
  
  // Contract addresses for Aptos protocols
  const contractAddresses = {
    amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
    thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
    tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
    ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
    aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
    echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
    pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
    liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
    cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6"
  };

  /**
   * Execute a single operation on a DeFi protocol
   * @param {string} protocol - Protocol name (e.g., 'amnis', 'thala')
   * @param {string} type - Operation type (e.g., 'stake', 'unstake', 'lend')
   * @param {string|number} amount - Amount of tokens for the operation
   * @param {string} [contractAddress] - Override contract address
   * @param {string} [functionName] - Override function name
   * @returns {Promise<Object>} - Transaction result
   */
  const executeOperation = useCallback(async (
    protocol, 
    type, 
    amount, 
    contractAddress, 
    functionName
  ) => {
    if (!walletAddress || !walletProvider) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      throw new Error('Wallet not connected');
    }
    
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      setNotification({
        type: 'error',
        message: 'Invalid amount for transaction'
      });
      throw new Error('Invalid amount');
    }
    
    // Generate transaction ID
    const txId = `${Date.now()}-${protocol}-${type}`;
    setCurrentTxId(txId);
    
    // Determine contract address if not provided
    if (!contractAddress) {
      contractAddress = contractAddresses[protocol.toLowerCase()];
      if (!contractAddress) {
        setNotification({
          type: 'error',
          message: `Unknown protocol: ${protocol}`
        });
        throw new Error(`Unknown protocol: ${protocol}`);
      }
    }
    
    // Determine function name if not provided
    if (!functionName) {
      functionName = determineFunctionName(protocol, type);
    }
    
    try {
      setExecuting(true);
      setTxProgress(10);
      setTxStatus('preparing');
      
      // Create new transaction in context
      addTransaction({
        id: txId,
        protocol,
        type,
        amount: parseFloat(amount),
        status: 'preparing',
        timestamp: new Date().toISOString()
      });
      
      // Convert APT to octas (10^8 multiplication for Aptos)
      const amountInOctas = Math.floor(parseFloat(amount) * 100000000).toString();
      
      // Prepare transaction payload
      const transaction = {
        function: `${contractAddress}${functionName}`,
        type_arguments: [],
        arguments: [amountInOctas]
      };
      
      setTxProgress(30);
      setTxStatus('signing');
      updateTransaction(txId, { status: 'signing' });
      
      // Display notification
      setNotification({
        type: 'info',
        message: `Preparing to ${type} on ${protocol}. Please confirm in your wallet.`
      });
      
      // Sign and submit transaction
      const result = await walletProvider.signAndSubmitTransaction(transaction);
      
      // Extract transaction hash
      const hash = result.hash || result.txHash || result.transaction?.hash;
      if (!hash) {
        throw new Error('Transaction submitted but no hash returned');
      }
      
      setTxProgress(50);
      setTxStatus('submitted');
      updateTransaction(txId, { 
        status: 'submitted',
        hash
      });
      
      setNotification({
        type: 'info',
        message: `Transaction submitted, waiting for confirmation...`
      });
      
      // Poll for transaction status
      const confirmation = await pollTransactionStatus(hash);
      
      setTxProgress(100);
      
      // Check if transaction was successful
      if (confirmation.success) {
        setTxStatus('confirmed');
        updateTransaction(txId, { 
          status: 'confirmed',
          result: confirmation
        });
        
        setNotification({
          type: 'success',
          message: `Successfully executed ${type} operation on ${protocol}`
        });
      } else {
        setTxStatus('failed');
        updateTransaction(txId, { 
          status: 'failed',
          error: confirmation.vm_status || 'Transaction failed on-chain'
        });
        
        setNotification({
          type: 'error',
          message: `Transaction failed: ${confirmation.vm_status || 'Unknown error'}`
        });
        
        throw new Error(confirmation.vm_status || 'Transaction failed on-chain');
      }
      
      return {
        success: confirmation.success,
        txId,
        hash,
        result: confirmation
      };
    } catch (error) {
      console.error(`Error executing ${type} on ${protocol}:`, error);
      
      let errorMessage = error.message;
      
      // Handle user rejection separately
      if (errorMessage.includes('User rejected') || 
          errorMessage.includes('Rejected by user') ||
          errorMessage.includes('cancelled')) {
        setTxStatus('rejected');
        updateTransaction(txId, { 
          status: 'rejected',
          error: 'Transaction rejected by user'
        });
        
        setNotification({
          type: 'warning',
          message: 'Transaction rejected by user'
        });
      } else {
        setTxStatus('failed');
        updateTransaction(txId, { 
          status: 'failed',
          error: errorMessage
        });
        
        setNotification({
          type: 'error',
          message: `Failed to execute operation: ${errorMessage}`
        });
      }
      
      throw error;
    } finally {
      setExecuting(false);
      setCurrentTxId(null);
    }
  }, [walletAddress, walletProvider, addTransaction, updateTransaction, setNotification]);

  /**
   * Execute multiple operations in sequence as a strategy
   * @param {Array} operations - Array of operation objects
   * @param {Object} options - Execution options
   * @returns {Promise<Object>} - Results of all operations
   */
  const executeStrategy = useCallback(async (operations, options = {}) => {
    if (!walletAddress || !walletProvider) {
      setNotification({
        type: 'error',
        message: 'Please connect your wallet first'
      });
      throw new Error('Wallet not connected');
    }
    
    if (!operations || !Array.isArray(operations) || operations.length === 0) {
      setNotification({
        type: 'error',
        message: 'No operations to execute'
      });
      throw new Error('No operations provided');
    }
    
    // Create new abort controller for this strategy execution
    const controller = new AbortController();
    setAbortController(controller);
    
    // Strategy execution ID
    const strategyId = `strategy-${Date.now()}`;
    
    try {
      setExecuting(true);
      setTxProgress(5);
      setTxStatus('preparing');
      
      // Show notification about strategy execution
      setNotification({
        type: 'info',
        message: `Executing strategy with ${operations.length} operations. Please confirm each transaction.`
      });
      
      // Optimize operation order (withdrawals/unstakes before deposits/stakes)
      const optimizedOperations = optimizeOperationOrder(operations);
      
      // Results objects
      const results = {
        strategyId,
        operations: [],
        failedOperations: [],
        success: true,
        startTime: Date.now()
      };
      
      setTxProgress(10);
      
      // Execute operations in sequence
      for (let i = 0; i < optimizedOperations.length; i++) {
        // Check if execution was aborted
        if (controller.signal.aborted) {
          throw new Error('Strategy execution was aborted by user');
        }
        
        const operation = optimizedOperations[i];
        const progressPerOperation = 80 / optimizedOperations.length;
        const baseProgress = 10 + (i * progressPerOperation);
        
        setTxProgress(baseProgress);
        setTxStatus(`executing_${i + 1}_of_${optimizedOperations.length}`);
        
        try {
          // Execute the operation
          const result = await executeOperation(
            operation.protocol,
            operation.type,
            operation.amount,
            operation.contractAddress,
            operation.functionName
          );
          
          // Add to successful operations
          results.operations.push({
            ...operation,
            status: 'success',
            result
          });
          
          setTxProgress(baseProgress + progressPerOperation);
        } catch (error) {
          // Add to failed operations
          results.failedOperations.push({
            ...operation,
            status: 'failed',
            error: error.message
          });
          
          results.success = false;
          
          // Check if we should abort the whole strategy
          if (shouldAbortStrategy(operation, results, options)) {
            throw new Error(`Critical operation failed: ${error.message}`);
          }
          
          // Show warning but continue with next operation
          setNotification({
            type: 'warning',
            message: `Operation ${i + 1} failed, continuing with remaining operations`
          });
        }
        
        // Add a slight delay between operations
        if (i < optimizedOperations.length - 1) {
          await new Promise(resolve => setTimeout(resolve, options.delay || 500));
        }
      }
      
      setTxProgress(100);
      setTxStatus(results.success ? 'completed' : 'completed_with_errors');
      
      // Final notification
      setNotification({
        type: results.success ? 'success' : 'warning',
        message: results.success
          ? `Strategy executed successfully! ${results.operations.length} operations completed.`
          : `Strategy execution completed with ${results.failedOperations.length} failures.`
      });
      
      results.endTime = Date.now();
      results.duration = results.endTime - results.startTime;
      
      return results;
    } catch (error) {
      console.error('Strategy execution error:', error);
      
      setTxProgress(100);
      setTxStatus('failed');
      
      setNotification({
        type: 'error',
        message: `Strategy execution failed: ${error.message}`
      });
      
      throw error;
    } finally {
      setExecuting(false);
      setAbortController(null);
    }
  }, [walletAddress, walletProvider, executeOperation, setNotification]);

  /**
   * Abort the current strategy execution
   */
  const abortExecution = useCallback(() => {
    if (abortController) {
      abortController.abort();
      setNotification({
        type: 'warning',
        message: 'Execution aborted by user'
      });
    }
  }, [abortController, setNotification]);

  /**
   * Poll for transaction status until confirmed
   * @param {string} txHash - Transaction hash to check
   * @param {number} maxAttempts - Maximum polling attempts
   * @param {number} interval - Polling interval in ms
   * @returns {Promise<Object>} - Transaction status
   */
  const pollTransactionStatus = async (txHash, maxAttempts = 30, interval = 2000) => {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        // Use Aptos explorer API to fetch transaction status
        const response = await fetch(`https://fullnode.${networkType || 'mainnet'}.aptoslabs.com/v1/transactions/by_hash/${txHash}`);
        
        if (!response.ok) {
          console.warn(`Error fetching transaction status: ${response.status}`);
          await new Promise(resolve => setTimeout(resolve, interval));
          continue;
        }
        
        const data = await response.json();
        
        // If transaction is found and has success field, we're done
        if (data && data.success !== undefined) {
          return data;
        }
      } catch (error) {
        console.warn(`Error polling transaction (attempt ${attempt + 1}):`, error.message);
      }
      
      // Wait before checking again
      await new Promise(resolve => setTimeout(resolve, interval));
    }
    
    // If we've reached maximum attempts without conclusion
    throw new Error('Timed out waiting for transaction confirmation');
  };

  /**
   * Determine if we should abort the entire strategy after an operation fails
   * @param {Object} failedOperation - The operation that failed
   * @param {Object} currentResults - Current execution results
   * @param {Object} options - Strategy execution options
   * @returns {boolean} - Whether to abort
   */
  const shouldAbortStrategy = (failedOperation, currentResults, options) => {
    // Always abort if explicitly marked as critical
    if (failedOperation.critical) {
      return true;
    }
    
    // Check if we've exceeded the failure threshold
    const totalOps = currentResults.operations.length + currentResults.failedOperations.length;
    const failureRate = currentResults.failedOperations.length / totalOps;
    
    // Abort if more than 40% of operations have failed (or custom threshold)
    const failureThreshold = options.failureThreshold || 0.4;
    if (failureRate > failureThreshold && currentResults.failedOperations.length >= 2) {
      return true;
    }
    
    return false;
  };

  /**
   * Optimize the order of operations for execution
   * @param {Array} operations - Operations to optimize
   * @returns {Array} - Optimized operations
   */
  const optimizeOperationOrder = (operations) => {
    if (!operations || operations.length <= 1) return operations;
    
    // First do all operations that free up APT
    const withdrawTypes = ['unstake', 'withdraw', 'removeliquidity'];
    
    const withdrawOps = operations
      .filter(op => withdrawTypes.includes(op.type.toLowerCase()))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
      
    const addOps = operations
      .filter(op => !withdrawTypes.includes(op.type.toLowerCase()))
      .sort((a, b) => parseFloat(b.amount) - parseFloat(a.amount));
    
    return [...withdrawOps, ...addOps];
  };

  /**
   * Determine the function name for a protocol operation
   * @param {string} protocol - Protocol name
   * @param {string} operationType - Operation type
   * @returns {string} - Function name
   */
  const determineFunctionName = (protocol, operationType) => {
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
        'removeLiquidity': '::pool::remove_liquidity' 
      },
      'pancakeswap': { 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input' 
      },
      'liquidswap': { 
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
      case 'swap': return '::router::swap_exact_input';
      default: return `::${operationLower}::execute`;
    }
  };