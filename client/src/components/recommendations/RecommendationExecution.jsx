// src/components/recommendations/RecommendationExecution.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWalletContext } from '../../context/WalletContext';
import { useTransactionContext } from '../../context/TransactionContext';
import { useNotification } from '../../context/NotificationContext';
import Button from '../common/Button';
import Card from '../common/Card';

/**
 * Component for executing AI-recommended transactions
 * 
 * @param {Object} props Component props
 * @param {Object} props.recommendation The recommendation to execute
 * @param {Function} props.onComplete Callback when execution completes
 * @param {Function} props.onCancel Callback when user cancels
 */
const RecommendationExecution = ({ recommendation, onComplete, onCancel }) => {
  // Component state
  const [step, setStep] = useState('confirm'); // confirm, executing, complete, error
  const [executing, setExecuting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentOperation, setCurrentOperation] = useState(null);
  const [operationIndex, setOperationIndex] = useState(-1);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
  // Hooks
  const navigate = useNavigate();
  const { isConnected } = useWalletContext();
  const { executeStrategy, executionStatus } = useTransactionContext();
  const { showNotification } = useNotification();
  
  // Update progress based on execution status
  useEffect(() => {
    if (executionStatus) {
      setProgress(executionStatus.progress);
      
      if (executionStatus.status === 'executing') {
        setStep('executing');
      } else if (executionStatus.status === 'success') {
        setStep('complete');
      } else if (executionStatus.status === 'failed' || executionStatus.status === 'partial') {
        setStep('error');
        setError(executionStatus.message);
      }
    }
  }, [executionStatus]);
  
  // Prepare operations from recommendation
  const operations = React.useMemo(() => {
    if (!recommendation?.allocation) return [];
    
    return recommendation.allocation.map(item => {
      // Determine operation type
      const type = item.type || 'stake';
      
      // Calculate amount if percentage is provided
      const amount = item.amount || 
        ((parseFloat(recommendation.totalInvestment || 100) * parseFloat(item.percentage || 0) / 100).toFixed(2));
      
      return {
        protocol: item.protocol,
        type,
        amount,
        expectedApr: parseFloat(item.expectedApr || 0)
      };
    });
  }, [recommendation]);
  
  // Handle confirm button click
  const handleConfirm = async () => {
    if (!isConnected) {
      showNotification('Please connect your wallet first', 'error');
      return;
    }
    
    if (!recommendation) {
      showNotification('No recommendation to execute', 'error');
      return;
    }
    
    setExecuting(true);
    setStep('executing');
    setProgress(0);
    
    try {
      // Execute the strategy
      const result = await executeStrategy(recommendation);
      
      if (result.success) {
        setResults(result);
        setStep('complete');
        setProgress(100);
      } else {
        setError('Strategy execution failed');
        setStep('error');
        setProgress(100);
      }
    } catch (error) {
      console.error('Strategy execution error:', error);
      setError(error.message || 'Failed to execute strategy');
      setStep('error');
      setProgress(100);
    } finally {
      setExecuting(false);
    }
  };
  
  // Handle cancel button click
  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };
  
  // Handle complete button click
  const handleComplete = () => {
    if (onComplete) {
      onComplete(results);
    }
  };
  
  // Handle trying again
  const handleTryAgain = () => {
    setStep('confirm');
    setProgress(0);
    setError(null);
  };
  
  // Handle view portfolio click
  const handleViewPortfolio = () => {
    navigate('/wallet');
  };
  
  // Render UI for confirm step
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
            disabled={executing}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleConfirm}
            disabled={executing}
          >
            Confirm
          </Button>
        </div>
      </div>
    );
  };

  // Render UI for executing step
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
          <p className="text-sm text-gray-400">
            {executionStatus?.message || 'Processing transactions...'}
          </p>
        </div>

        <div className="space-y-3">
          {operations.map((op, index) => {
            const isActive = index === operationIndex;
            const isComplete = index < operationIndex;
            
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

  // Render UI for complete step
  const renderCompleteStep = () => {
    if (!results) return null;
    
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
            {results.transactions?.length || 0} operation{results.transactions?.length !== 1 ? 's' : ''} completed successfully.
            {results.failedTransactions?.length > 0 && 
              ` ${results.failedTransactions.length} operation${results.failedTransactions.length !== 1 ? 's' : ''} failed.`
            }
          </p>
        </div>

        {results.failedTransactions?.length > 0 && (
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

        <div className="flex justify-center space-x-3">
          <Button variant="outline" onClick={handleViewPortfolio}>
            View Portfolio
          </Button>
          <Button variant="primary" onClick={handleComplete}>
            Done
          </Button>
        </div>
      </div>
    );
  };

  // Render UI for error step
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
            {error || 'There was an error executing the strategy.'}
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
            onClick={handleTryAgain}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  };

  // Render component based on current step
  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-6">
        {step === 'confirm' && renderConfirmStep()}
        {step === 'executing' && renderExecutingStep()}
        {step === 'complete' && renderCompleteStep()}
        {step === 'error' && renderErrorStep()}
      </div>
    </Card>
  );
};

export default RecommendationExecution;