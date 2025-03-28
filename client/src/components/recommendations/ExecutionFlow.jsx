import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../common/Button';

/**
 * ExecutionFlow component for handling the transaction execution process
 * This component manages the user flow from strategy confirmation to execution completion
 * 
 * @param {Object} props - Component props
 * @param {Object} props.recommendation - The recommendation object with allocation details
 * @param {Function} props.onComplete - Callback for when execution completes
 * @param {Function} props.onCancel - Callback for when user cancels execution
 */
const ExecutionFlow = ({ recommendation, onComplete, onCancel }) => {
  // Execution flow states
  const [step, setStep] = useState('confirm'); // confirm, executing, complete, error
  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparing transactions...');
  const [operations, setOperations] = useState([]);
  const [currentOperationIndex, setCurrentOperationIndex] = useState(-1);
  const [executionResults, setExecutionResults] = useState(null);
  const [error, setError] = useState(null);
  
  // Execution state
  const [executing, setExecuting] = useState(false);
  const [confirmDisabled, setConfirmDisabled] = useState(false);
  
  // Get wallet and notification context
  const { wallet, isConnected, executeTransaction } = useWalletContext();
  const { showNotification } = useNotification();
  
  // Prepare operations from recommendation when component mounts
  useEffect(() => {
    if (recommendation && recommendation.allocation) {
      const ops = prepareOperationsFromRecommendation(recommendation);
      setOperations(ops);
    }
  }, [recommendation]);
  
  /**
   * Prepares transaction operations from the recommendation data
   */
  const prepareOperationsFromRecommendation = (recommendationData) => {
    if (!recommendationData?.allocation) {
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
    const operations = recommendationData.allocation.map(item => {
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
        ((parseFloat(recommendationData.totalInvestment || 100) * parseFloat(item.percentage || 0) / 100).toFixed(2));
      
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
    
    return operations;
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
  
  /**
   * Handles user confirmation to begin execution
   */
  const handleConfirm = async () => {
    if (!isConnected) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }
    
    if (operations.length === 0) {
      showNotification('No valid operations to execute', 'error');
      return;
    }
    
    setConfirmDisabled(true);
    setStep('executing');
    
    // Start execution process
    try {
      await executeStrategy();
    } catch (error) {
      console.error('Failed to start execution:', error);
      setStep('error');
      setError(error.message || 'Failed to initialize execution');
      setConfirmDisabled(false);
    }
  };
  
  /**
   * Execute all operations in the strategy
   */
  const executeStrategy = async () => {
    try {
      setExecuting(true);
      setProgress(5);
      setStatusMessage('Starting strategy execution...');
      
      // Track execution start for analytics
      trackExecutionStart();
      
      const results = {
        success: true,
        operations: [],
        failedOperations: [],
        startTime: Date.now()
      };
      
      // Execute operations sequentially
      for (let i = 0; i < operations.length; i++) {
        setCurrentOperationIndex(i);
        const operation = operations[i];
        
        // Update progress
        const progressPerOp = 90 / operations.length;
        setProgress(5 + (i * progressPerOp));
        setStatusMessage(`Executing ${operation.type} on ${operation.protocol}...`);
        
        try {
          // Create transaction payload
          const amountInOctas = Math.floor(parseFloat(operation.amount) * 100000000).toString();
          const txPayload = {
            function: `${operation.contractAddress}${operation.functionName}`,
            type_arguments: [],
            arguments: [amountInOctas]
          };
          
          // Execute transaction
          const txResult = await executeTransaction(txPayload);
          
          // Add to successful operations
          results.operations.push({
            ...operation,
            result: txResult,
            status: 'success'
          });
          
          // Update progress
          setProgress(5 + ((i + 1) * progressPerOp));
          
          // Show success notification
          showNotification(`Successfully executed ${operation.type} on ${operation.protocol}`, 'success');
          
          // Add delay between transactions
          if (i < operations.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        } catch (error) {
          console.error(`Operation failed: ${operation.type} on ${operation.protocol}`, error);
          
          // Add to failed operations
          results.failedOperations.push({
            ...operation,
            error: error.message,
            status: 'failed'
          });
          
          // Show error notification
          showNotification(`Failed to execute ${operation.type} on ${operation.protocol}: ${error.message}`, 'error');
          
          results.success = false;
          
          // Continue with next operation instead of aborting everything
        }
      }
      
      // Finalize progress
      setProgress(100);
      setStatusMessage('Execution complete');
      
      // Add final metrics
      results.endTime = Date.now();
      results.duration = results.endTime - results.startTime;
      results.totalOperations = operations.length;
      results.successfulOperations = results.operations.length;
      
      // Update state
      setExecutionResults(results);
      setStep(results.success ? 'complete' : 'error');
      
      // Show final notification
      showNotification(
        results.success 
          ? `Strategy executed successfully! ${results.operations.length} operations completed.` 
          : `Strategy execution completed with ${results.failedOperations.length} failures.`,
        results.success ? 'success' : 'warning'
      );
      
      // If complete callback provided, call it
      if (onComplete) {
        onComplete(results);
      }
      
      return results;
    } catch (error) {
      console.error('Strategy execution error:', error);
      
      setStep('error');
      setStatusMessage(`Execution failed: ${error.message}`);
      setError(error.message || 'Unknown execution error');
      
      showNotification(`Strategy execution failed: ${error.message}`, 'error');
      
      return { success: false, error: error.message };
    } finally {
      setExecuting(false);
    }
  };
  
  /**
   * Track execution start for analytics
   */
  const trackExecutionStart = () => {
    // Implement analytics tracking if needed
    console.log('Strategy execution started:', recommendation.title || 'AI Strategy');
  };
  
  /**
   * Handle cancel button click
   */
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  /**
   * Render UI for confirm step
   */
  const renderConfirmStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-200">
          Confirm Strategy Execution
        </h3>

        <p className="text-gray-300">
          You are about to execute the following operations:
        </p>

        <div className="max-h-60 overflow-y-auto bg-gray-800 rounded-md shadow p-4">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2 text-gray-400">Protocol</th>
                <th className="text-left py-2 text-gray-400">Operation</th>
                <th className="text-right py-2 text-gray-400">Amount</th>
                <th className="text-right py-2 text-gray-400">APR</th>
              </tr>
            </thead>
            <tbody>
              {operations.map((op, index) => (
                <tr key={index} className="border-b border-gray-700">
                  <td className="py-2 font-medium text-white">{op.protocol}</td>
                  <td className="py-2 capitalize text-white">{op.type}</td>
                  <td className="py-2 text-right text-white">{op.amount} APT</td>
                  <td className="py-2 text-right text-green-400">{op.expectedApr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-800 rounded p-4 text-sm text-yellow-300">
          <div className="flex">
            <svg
              className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p>Review the operations carefully. Once confirmed, transactions cannot be reverted.</p>
              <p className="mt-1">You will need to sign {operations.length} transaction{operations.length !== 1 ? 's' : ''} in your wallet.</p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button 
            variant="outline" 
            onClick={handleCancel}
            disabled={confirmDisabled}
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
      </div>
    );
  };

  /**
   * Render UI for executing step
   */
  const renderExecutingStep = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-gray-200">
          Executing Strategy
        </h3>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Progress</span>
            <span className="text-gray-300">{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-400">{statusMessage}</p>
        </div>

        <div className="space-y-3">
          {operations.map((op, index) => {
            const isActive = index === currentOperationIndex;
            const isComplete = index < currentOperationIndex;
            
            return (
              <div
                key={index}
                className={`p-3 rounded-md border ${
                  isActive
                    ? 'border-blue-500 bg-blue-900/20'
                    : isComplete
                    ? 'border-green-500 bg-green-900/20'
                    : 'border-gray-700'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium text-white">{op.protocol}</span>
                    <span className="text-sm text-gray-400 ml-2 capitalize">
                      {op.type}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="font-medium text-white">{op.amount} APT</span>
                    {isComplete && (
                      <svg
                        className="h-5 w-5 text-green-500"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {isActive && (
                      <svg
                        className="h-5 w-5 text-blue-500 animate-spin"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <p className="text-center text-sm text-gray-400">
          {executing
            ? 'Please confirm transactions in your wallet when prompted'
            : 'Processing transactions...'}
        </p>
      </div>
    );
  };

  /**
   * Render UI for complete step
   */
  const renderCompleteStep = () => {
    if (!executionResults) return null;
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-900/30 mb-4">
            <svg
              className="h-8 w-8 text-green-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-200">
            Strategy Execution Completed
          </h3>
          <p className="text-gray-300 mt-2">
            {executionResults.operations.length} operation{executionResults.operations.length !== 1 ? 's' : ''} completed successfully.
            {executionResults.failedOperations.length > 0 && 
              ` ${executionResults.failedOperations.length} operation${executionResults.failedOperations.length !== 1 ? 's' : ''} failed.`
            }
          </p>
        </div>

        {executionResults.failedOperations.length > 0 && (
          <div className="bg-yellow-900/20 border border-yellow-800 rounded p-4 text-sm text-yellow-300">
            <div className="flex">
              <svg
                className="h-5 w-5 text-yellow-500 mr-2 flex-shrink-0"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div>
                <p>Some operations failed to execute. You may want to try them again later.</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-green-900/20 border border-green-800 rounded p-4">
          <h4 className="font-medium text-green-400 mb-2">
            Your portfolio has been optimized
          </h4>
          <p className="text-green-300 text-sm">
            Your assets are now allocated according to the recommended strategy.
            CompounDefi will continue to monitor market conditions and suggest adjustments when needed.
          </p>
        </div>

        <div className="text-center">
          <Button variant="primary" onClick={onComplete}>
            View Updated Portfolio
          </Button>
        </div>
      </div>
    );
  };

  /**
   * Render UI for error step
   */
  const renderErrorStep = () => {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-900/30 mb-4">
            <svg
              className="h-8 w-8 text-red-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-200">
            Strategy Execution Failed
          </h3>
          <p className="text-gray-300 mt-2">
            {error || statusMessage || 'There was an error executing the strategy.'}
          </p>
        </div>

        <div className="bg-red-900/20 border border-red-800 rounded p-4 text-sm text-red-300">
          <div className="flex">
            <svg
              className="h-5 w-5 text-red-500 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            <div>
              <p>The execution was interrupted or failed to complete. Possible reasons:</p>
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
          <Button variant="outline" onClick={handleCancel}>
            Back to Recommendations
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              setStep('confirm');
              setConfirmDisabled(false);
              setProgress(0);
              setStatusMessage('Preparing transactions...');
              setError(null);
            }}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  // Render component based on current step
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-3xl w-full border border-gray-700">
      {step === 'confirm' && renderConfirmStep()}
      {step === 'executing' && renderExecutingStep()}
      {step === 'complete' && renderCompleteStep()}
      {step === 'error' && renderErrorStep()}
    </div>
  );
};

export default ExecutionFlow;