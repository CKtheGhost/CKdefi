import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';
import { useWallet } from '../hooks/useWallet';
import { useNotification } from '../hooks/useNotification';
import { PROTOCOL_ADDRESSES } from '../utils/constants';

// Initial state for transaction context
const initialState = {
  pendingTransactions: [],
  transactionHistory: [],
  currentTransaction: null,
  isExecuting: false,
  executionStatus: null, // null, 'pending', 'success', 'failed'
  error: null,
  recentOperations: []
};

// Transaction action types
const ACTIONS = {
  SET_PENDING_TRANSACTIONS: 'SET_PENDING_TRANSACTIONS',
  SET_TRANSACTION_HISTORY: 'SET_TRANSACTION_HISTORY',
  START_TRANSACTION: 'START_TRANSACTION',
  SET_EXECUTION_STATUS: 'SET_EXECUTION_STATUS',
  TRANSACTION_SUCCESS: 'TRANSACTION_SUCCESS',
  TRANSACTION_FAILED: 'TRANSACTION_FAILED',
  RESET_TRANSACTION: 'RESET_TRANSACTION',
  ADD_OPERATION: 'ADD_OPERATION',
  CLEAR_OPERATIONS: 'CLEAR_OPERATIONS',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer function to handle transaction state updates
function transactionReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_PENDING_TRANSACTIONS:
      return {
        ...state,
        pendingTransactions: action.payload
      };
    case ACTIONS.SET_TRANSACTION_HISTORY:
      return {
        ...state,
        transactionHistory: action.payload
      };
    case ACTIONS.START_TRANSACTION:
      return {
        ...state,
        currentTransaction: action.payload,
        isExecuting: true,
        executionStatus: 'pending',
        error: null
      };
    case ACTIONS.SET_EXECUTION_STATUS:
      return {
        ...state,
        executionStatus: action.payload
      };
    case ACTIONS.TRANSACTION_SUCCESS:
      return {
        ...state,
        isExecuting: false,
        executionStatus: 'success',
        transactionHistory: [action.payload, ...state.transactionHistory],
        pendingTransactions: state.pendingTransactions.filter(
          tx => tx.id !== (action.payload.id || action.payload.txId)
        )
      };
    case ACTIONS.TRANSACTION_FAILED:
      return {
        ...state,
        isExecuting: false,
        executionStatus: 'failed',
        error: action.payload.error,
        currentTransaction: {
          ...state.currentTransaction,
          error: action.payload.error
        }
      };
    case ACTIONS.RESET_TRANSACTION:
      return {
        ...state,
        currentTransaction: null,
        isExecuting: false,
        executionStatus: null,
        error: null
      };
    case ACTIONS.ADD_OPERATION:
      return {
        ...state,
        recentOperations: [...state.recentOperations, action.payload]
      };
    case ACTIONS.CLEAR_OPERATIONS:
      return {
        ...state,
        recentOperations: []
      };
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isExecuting: false
      };
    case ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    default:
      return state;
  }
}

// Create the transaction context
const TransactionContext = createContext();

// Transaction context provider component
export function TransactionProvider({ children }) {
  const [state, dispatch] = useReducer(transactionReducer, initialState);
  const { wallet, isConnected, signAndSubmitTransaction } = useWallet();
  const { showNotification } = useNotification();

  // Fetch pending transactions on wallet change
  useEffect(() => {
    if (isConnected && wallet?.address) {
      fetchPendingTransactions(wallet.address);
      fetchTransactionHistory(wallet.address);
    }
  }, [isConnected, wallet?.address]);

  // Fetch pending transactions
  const fetchPendingTransactions = useCallback(async (address) => {
    try {
      const response = await fetch(`/api/wallet/${address}/pending-transactions`);
      const data = await response.json();
      if (response.ok) {
        dispatch({
          type: ACTIONS.SET_PENDING_TRANSACTIONS,
          payload: data.transactions || []
        });
      }
    } catch (error) {
      console.error('Error fetching pending transactions:', error);
    }
  }, []);

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async (address, limit = 20) => {
    try {
      const response = await fetch(`/api/wallet/${address}/transactions?limit=${limit}`);
      const data = await response.json();
      if (response.ok) {
        dispatch({
          type: ACTIONS.SET_TRANSACTION_HISTORY,
          payload: data.transactions || []
        });
      }
    } catch (error) {
      console.error('Error fetching transaction history:', error);
    }
  }, []);

  // Execute a strategy (multiple operations)
  const executeStrategy = useCallback(async (strategy) => {
    if (!isConnected || !wallet?.address) {
      showNotification('Please connect your wallet to execute transactions', 'error');
      return;
    }

    if (!strategy || !strategy.allocation || strategy.allocation.length === 0) {
      showNotification('Invalid strategy. No allocation provided.', 'error');
      return;
    }

    try {
      // Start transaction process
      dispatch({
        type: ACTIONS.START_TRANSACTION,
        payload: {
          type: 'strategy',
          data: strategy,
          timestamp: new Date().toISOString()
        }
      });

      // Convert strategy to operations
      const operations = strategy.allocation.map(item => ({
        protocol: item.protocol,
        type: determineOperationType(item.product),
        amount: item.amount,
        contractAddress: PROTOCOL_ADDRESSES[item.protocol.toLowerCase()] || getContractAddress(item.protocol),
        functionName: getFunctionName(item.protocol, determineOperationType(item.product))
      }));

      // Prepare API request
      const requestData = {
        walletAddress: wallet.address,
        amount: strategy.totalInvestment,
        allocation: strategy.allocation,
        operations
      };

      // Simulate the transactions first
      const simulateResponse = await fetch('/api/execute-strategy/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData)
      });

      const simulationResult = await simulateResponse.json();

      if (!simulationResult.success) {
        throw new Error(simulationResult.error || 'Transaction simulation failed');
      }

      // Show confirmation to user
      showNotification('Transaction simulation successful. Ready to execute.', 'info');

      // Execute the operations
      dispatch({ type: ACTIONS.SET_EXECUTION_STATUS, payload: 'executing' });

      // Execute each operation in sequence
      for (const operation of operations) {
        try {
          // Create transaction payload
          const payload = {
            function: `${operation.contractAddress}${operation.functionName}`,
            type_arguments: [],
            arguments: [convertAmountToOnChain(operation.amount)]
          };

          // Sign and submit the transaction
          const result = await signAndSubmitTransaction(payload);

          if (result.success) {
            dispatch({
              type: ACTIONS.ADD_OPERATION,
              payload: {
                ...operation,
                status: 'success',
                txHash: result.hash,
                timestamp: new Date().toISOString()
              }
            });
            
            showNotification(`Successfully executed ${operation.type} on ${operation.protocol}`, 'success');
          } else {
            throw new Error(result.error || 'Transaction failed');
          }
        } catch (opError) {
          dispatch({
            type: ACTIONS.ADD_OPERATION,
            payload: {
              ...operation,
              status: 'failed',
              error: opError.message,
              timestamp: new Date().toISOString()
            }
          });
          
          showNotification(`Failed to execute ${operation.type} on ${operation.protocol}: ${opError.message}`, 'error');
        }
      }

      // Update transaction status based on operations
      const successfulOps = state.recentOperations.filter(op => op.status === 'success');
      const allSuccessful = successfulOps.length === operations.length;

      if (allSuccessful) {
        dispatch({
          type: ACTIONS.TRANSACTION_SUCCESS,
          payload: {
            type: 'strategy',
            status: 'success',
            operations: [...state.recentOperations],
            timestamp: new Date().toISOString()
          }
        });
        
        showNotification('Strategy execution completed successfully!', 'success');
      } else if (successfulOps.length > 0) {
        dispatch({
          type: ACTIONS.TRANSACTION_SUCCESS,
          payload: {
            type: 'strategy',
            status: 'partial',
            operations: [...state.recentOperations],
            timestamp: new Date().toISOString()
          }
        });
        
        showNotification('Strategy execution partially completed', 'warning');
      } else {
        throw new Error('All operations failed');
      }

      // Refresh transaction data
      fetchPendingTransactions(wallet.address);
      fetchTransactionHistory(wallet.address);
      
      return {
        success: allSuccessful || successfulOps.length > 0,
        operations: state.recentOperations
      };
    } catch (error) {
      dispatch({
        type: ACTIONS.TRANSACTION_FAILED,
        payload: { error: error.message }
      });
      
      showNotification(`Strategy execution failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    } finally {
      setTimeout(() => {
        dispatch({ type: ACTIONS.CLEAR_OPERATIONS });
      }, 5000);
    }
  }, [isConnected, wallet, showNotification, state.recentOperations]);

  // Execute a single operation
  const executeOperation = useCallback(async (operation) => {
    if (!isConnected || !wallet?.address) {
      showNotification('Please connect your wallet to execute transactions', 'error');
      return { success: false, error: 'Wallet not connected' };
    }

    try {
      // Start transaction process
      dispatch({
        type: ACTIONS.START_TRANSACTION,
        payload: {
          type: 'operation',
          data: operation,
          timestamp: new Date().toISOString()
        }
      });

      // Create transaction payload
      const payload = {
        function: `${operation.contractAddress}${operation.functionName}`,
        type_arguments: [],
        arguments: [convertAmountToOnChain(operation.amount)]
      };

      // Sign and submit transaction
      const result = await signAndSubmitTransaction(payload);

      if (result.success) {
        dispatch({
          type: ACTIONS.TRANSACTION_SUCCESS,
          payload: {
            ...operation,
            status: 'success',
            txHash: result.hash,
            timestamp: new Date().toISOString()
          }
        });
        
        showNotification(`Successfully executed ${operation.type} on ${operation.protocol}`, 'success');
        return { success: true, hash: result.hash };
      } else {
        throw new Error(result.error || 'Transaction failed');
      }
    } catch (error) {
      dispatch({
        type: ACTIONS.TRANSACTION_FAILED,
        payload: { error: error.message }
      });
      
      showNotification(`Transaction failed: ${error.message}`, 'error');
      return { success: false, error: error.message };
    }
  }, [isConnected, wallet, showNotification]);

  // Reset current transaction state
  const resetTransaction = useCallback(() => {
    dispatch({ type: ACTIONS.RESET_TRANSACTION });
  }, []);

  // Helper function to determine operation type
  function determineOperationType(product) {
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
  }

  // Helper function to get contract address
  function getContractAddress(protocol) {
    return PROTOCOL_ADDRESSES[protocol.toLowerCase()] || null;
  }

  // Helper function to get function name
  function getFunctionName(protocol, operation) {
    const functionMappings = {
      'amnis': { 
        'stake': '::staking::stake', 
        'unstake': '::staking::unstake', 
        'lend': '::lending::supply', 
        'withdraw': '::lending::withdraw', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
      },
      'thala': { 
        'stake': '::staking::stake_apt', 
        'unstake': '::staking::unstake_apt', 
        'lend': '::lending::supply_apt', 
        'withdraw': '::lending::withdraw_apt', 
        'addLiquidity': '::router::add_liquidity', 
        'removeLiquidity': '::router::remove_liquidity',
        'swap': '::router::swap_exact_input'
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
      }
    };
    
    const lowerProtocol = protocol.toLowerCase();
    const lowerOperation = operation.toLowerCase();
    
    // Check for specific protocol-operation mapping
    if (functionMappings[lowerProtocol]?.[lowerOperation]) {
      return functionMappings[lowerProtocol][lowerOperation];
    }
    
    // Default function names by operation type
    const defaultFunctions = {
      'stake': '::staking::stake',
      'unstake': '::staking::unstake',
      'lend': '::lending::supply',
      'withdraw': '::lending::withdraw',
      'addLiquidity': '::router::add_liquidity',
      'removeLiquidity': '::router::remove_liquidity',
      'deposit': '::yield::deposit',
      'swap': '::router::swap_exact_input'
    };
    
    return defaultFunctions[lowerOperation] || `::${lowerOperation}::execute`;
  }

  // Helper function to convert amount to on-chain format (APT has 8 decimals)
  function convertAmountToOnChain(amount) {
    const amountNum = parseFloat(amount);
    if (isNaN(amountNum)) return '0';
    return (amountNum * 100000000).toFixed(0); // 8 decimals for APT
  }

  // Context value
  const value = {
    ...state,
    executeStrategy,
    executeOperation,
    resetTransaction,
    fetchPendingTransactions,
    fetchTransactionHistory
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

// Custom hook to use the transaction context
export function useTransaction() {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransaction must be used within a TransactionProvider');
  }
  return context;
}