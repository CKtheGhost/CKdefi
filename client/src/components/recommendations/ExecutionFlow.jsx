// client/src/components/recommendations/ExecutionFlow.jsx
// Transaction execution flow UI component

import React, { useState, useEffect, useCallback, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import transactionService from '../../services/transactionService';
import { WalletContext } from '../../context/WalletContext';
import { DataContext } from '../../context/DataContext';
import Button from '../common/Button';

/**
 * ExecutionFlow - Handles the UI flow for executing AI recommendations
 * Shows confirmation, execution progress, and results
 */
const ExecutionFlow = ({ recommendation, onComplete, onCancel }) => {
  const [step, setStep] = useState('confirm'); // confirm, executing, complete, error
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing transactions...');
  const [results, setResults] = useState(null);
  const [operations, setOperations] = useState([]);
  const [executing, setExecuting] = useState(false);

  const { wallet, isConnected } = useContext(WalletContext);
  const { refreshWalletData } = useContext(DataContext);

  // Parse operations from recommendation when component mounts
  useEffect(() => {
    if (recommendation && recommendation.allocation) {
      const ops = prepareOperationsFromRecommendation(recommendation);
      setOperations(ops);
    }
  }, [recommendation]);

  // Function to prepare operations from recommendation
  const prepareOperationsFromRecommendation = (recommendation) => {
    if (!recommendation.allocation) return [];
    
    // Get contract addresses from window global (initialized by defi-headquarters)
    const contractAddresses = window.contractAddresses || {};

    return recommendation.allocation.map(item => {
      // Determine operation type based on product
      const type = determineOperationType(item.product);
      
      // Get contract address for this protocol
      const contractAddress = contractAddresses[item.protocol.toLowerCase()];
      
      // Determine function name
      const functionName = determineFunctionName(item.protocol, type);
      
      // Calculate amount if not explicitly provided
      const amount = item.amount || 
        ((parseFloat(recommendation.totalInvestment || 100) * parseFloat(item.percentage || 0) / 100).toFixed(2));
      
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
        console.warn(`No contract address found for protocol: ${op.protocol}`);
        return false;
      }
      
      if (isNaN(parseFloat(op.amount)) || parseFloat(op.amount) <= 0) {
        console.warn(`Invalid amount for ${op.protocol}: ${op.amount}`);
        return false;
      }
      
      return true;
    });
  };

  // Helper functions for operation types and function names
  const determineOperationType = (product) => {
    if (!product) return 'stake';
    
    const lower = typeof product === 'string' ? product.toLowerCase() : '';
    
    if (lower.includes('stake') || lower.includes('stapt') || lower.includes('apt') && lower.includes('st')) {
      return 'stake';
    }
    
    if (lower.includes('lend') || lower.includes('lending') || lower.includes('supply') || lower.includes('loan')) {
      return 'lend';
    }
    
    if (lower.includes('liquidity') || lower.includes('amm') || lower.includes('pool') || lower.includes('swap')) {
      return 'addLiquidity';
    }
    
    if (lower.includes('yield') || lower.includes('farm') || lower.includes('vault')) {
      return 'deposit';
    }
    
    return 'stake'; // Default to staking
  };
  
  const determineFunctionName = (protocol, operationType) => {
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
    
    // Check for protocol-specific function mappings
    const normalizedProtocol = protocol?.toLowerCase();
    const normalizedOperation = operationType?.toLowerCase();
    
    if (functionMappings[normalizedProtocol]?.[normalizedOperation]) {
      return functionMappings[normalizedProtocol][normalizedOperation];
    }
    
    // Default function names by operation type
    switch (normalizedOperation) {
      case 'stake': return '::staking::stake';
      case 'unstake': return '::staking::unstake';
      case 'lend': return '::lending::supply';
      case 'withdraw': return '::lending::withdraw';
      case 'addliquidity': return '::router::add_liquidity';
      case 'removeliquidity': return '::router::remove_liquidity';
      case 'deposit': return '::yield::deposit';
      case 'swap': return '::router::swap_exact_input';
      default: return `::${normalizedOperation}::execute`;
    }
  };

  // Handle execution of operations
  const executeOperations = useCallback(async () => {
    if (!isConnected || !wallet) {
      toast.error('Wallet not connected');
      setStep('error');
      return;
    }

    if (operations.length === 0) {
      toast.error('No valid operations to execute');
      setStep('error');
      return;
    }

    try {
      setExecuting(true);
      setStep('executing');
      
      // Initialize transaction service with wallet provider
      const walletProvider = wallet.provider;
      transactionService.initialize(walletProvider);
      
      // Execute operations
      const result = await transactionService.executeStrategy(operations, {
        operationDelay: 1000,
        abortOnFailure: false,
        onProgress: (progressPercent, message) => {
          setProgress(progressPercent);
          setStatusMessage(message);
        }
      });
      
      // Update state with results
      setResults(result);
      setStep(result.success ? 'complete' : 'error');
      
      // Refresh wallet data
      setTimeout(() => {
        refreshWalletData();
      }, 2000);
      
    } catch (error) {
      console.error('Execution error:', error);
      setStep('error');
      setStatusMessage(`Execution failed: ${error.message}`);
      toast.error(`Failed to execute strategy: ${error.message}`);
    } finally {
      setExecuting(false);
    }
  }, [operations, wallet, isConnected, refreshWalletData]);

  // Handle confirm button click
  const handleConfirm = () => {
    setConfirmDisabled(true);
    executeOperations();
  };

  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) onCancel();
  };

  // Handle completed execution
  const handleComplete = () => {
    if (onComplete) onComplete(results);
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md p-6 max-w-3xl w-full">
      <AnimatePresence mode="wait">
        {step === 'confirm' && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Confirm Strategy Execution
            </h3>
            
            <p className="text-gray-600 dark:text-gray-300">
              You are about to execute the following operations:
            </p>
            
            <div className="max-h-60 overflow-y-auto bg-white dark:bg-gray-900 rounded-md shadow p-4">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b dark:border-gray-700">
                    <th className="text-left py-2">Protocol</th>
                    <th className="text-left py-2">Operation</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-right py-2">APR</th>
                  </tr>
                </thead>
                <tbody>
                  {operations.map((op, index) => (
                    <tr key={index} className="border-b dark:border-gray-700">
                      <td className="py-2 font-medium">{op.protocol}</td>
                      <td className="py-2">{op.type}</td>
                      <td className="py-2 text-right">{op.amount} APT</td>
                      <td className="py-2 text-right text-green-600">{op.expectedApr}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4 text-sm text-yellow-800 dark:text-yellow-200">
              <div className="flex">
                <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <div>
                  <p>Review the operations carefully. Once confirmed, transactions cannot be reverted.</p>
                  <p className="mt-1">You will need to sign multiple transactions in your wallet.</p>
                </div>
              </div>
            </div>
            
            <div className="flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleConfirm}
                disabled={confirmDisabled}
              >
                Confirm
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === 'executing' && (
          <motion.div
            key="executing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-800 dark:text-white">
              Executing Strategy
            </h3>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {statusMessage}
              </p>
            </div>
            
            <div className="space-y-4">
              {operations.map((op, index) => {
                const isActive = index === Math.floor((progress / 100) * operations.length);
                const isComplete = index < Math.floor((progress / 100) * operations.length);
                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-md border ${
                      isActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 
                      isComplete ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 
                      'border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">{op.protocol}</span>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {op.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="font-medium">{op.amount} APT</span>
                        {isComplete && (
                          <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        )}
                        {isActive && (
                          <svg className="h-5 w-5 text-blue-500 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <p className="text-center text-sm text-gray-600 dark:text-gray-400">
              {executing ? "Please confirm transactions in your wallet" : "Processing transactions..."}
            </p>
          </motion.div>
        )}
        
        {step === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Strategy Execution Completed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {results?.operations?.length || 0} operations completed successfully.
                {results?.failedOperations?.length > 0 && ` ${results.failedOperations.length} operations failed.`}
              </p>
            </div>
            
            {results?.failedOperations?.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded p-4 text-sm text-yellow-800 dark:text-yellow-200">
                <div className="flex">
                  <svg className="h-5 w-5 text-yellow-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <p>Some operations failed to execute. You may want to try them again later.</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded p-4">
              <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">Your portfolio has been optimized</h4>
              <p className="text-green-700 dark:text-green-300 text-sm">
                Your assets are now allocated according to the recommended strategy. 
                We'll continue to monitor market conditions and suggest adjustments when needed.
              </p>
            </div>
            
            <div className="text-center">
              <Button
                variant="primary"
                onClick={handleComplete}
              >
                View Updated Portfolio
              </Button>
            </div>
          </motion.div>
        )}
        
        {step === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-4">
                <svg className="h-8 w-8 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                Strategy Execution Failed
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mt-2">
                {statusMessage || "There was an error executing the strategy."}
              </p>
            </div>
            
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded p-4 text-sm text-red-800 dark:text-red-200">
              <div className="flex">
                <svg className="h-5 w-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p>The execution was interrupted or failed to complete. This could be due to:</p>
                  <ul className="list-disc pl-5 mt-1 space-y-1">
                    <li>Transaction rejected in wallet</li>
                    <li>Insufficient balance for gas fees</li>
                    <li>Network congestion or timeout</li>
                    <li>Contract execution error</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="outline"
                onClick={handleCancel}
              >
                Back to Recommendations
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setStep('confirm');
                  setConfirmDisabled(false);
                  setProgress(0);
                  setStatusMessage('Preparing transactions...');
                }}
              >
                Try Again
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExecutionFlow;