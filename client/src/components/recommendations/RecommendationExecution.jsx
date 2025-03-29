import React, { useState, useEffect, useContext } from 'react';
import { WalletContext } from '../../context/WalletContext';
import { NotificationContext } from '../../context/NotificationContext';
import { useTransactions } from '../../hooks/useTransactions';
import Button from '../common/Button';
import Spinner from '../common/Spinner';
import { formatCurrency, shortenAddress } from '../../utils/formatters';

const RecommendationExecution = ({ recommendation, onComplete, onCancel }) => {
  const { wallet, signAndSubmitTransaction } = useContext(WalletContext);
  const { showNotification } = useContext(NotificationContext);
  const { executeOperations } = useTransactions();
  
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionStep, setExecutionStep] = useState(0);
  const [operationResults, setOperationResults] = useState([]);
  const [error, setError] = useState(null);
  const [estimatedGas, setEstimatedGas] = useState(0);
  
  const steps = [
    'Preparing operations',
    'Estimating gas fees',
    'Waiting for confirmation',
    'Executing transactions',
    'Verifying transactions',
    'Completing'
  ];
  
  useEffect(() => {
    // Estimate gas for operations when component mounts
    const estimateGas = async () => {
      try {
        setExecutionStep(1);
        // Simple gas estimate based on operation count
        const gasPerOperation = 0.0001; // APT
        const estimatedGasAmount = recommendation.allocation.length * gasPerOperation;
        setEstimatedGas(estimatedGasAmount);
      } catch (err) {
        setError(`Failed to estimate gas: ${err.message}`);
      }
    };
    
    estimateGas();
  }, [recommendation]);
  
  const handleExecute = async () => {
    if (!wallet.connected) {
      showNotification('Please connect your wallet to execute this strategy', 'error');
      return;
    }
    
    try {
      setIsExecuting(true);
      setExecutionStep(2);
      
      // Format operations for execution
      const operations = recommendation.allocation.map(item => ({
        protocol: item.protocol,
        type: item.product.toLowerCase().includes('staking') ? 'stake' : 
              item.product.toLowerCase().includes('lending') ? 'lend' : 'addLiquidity',
        amount: item.amount,
        contractAddress: item.contractAddress || recommendation.agentCapabilities?.supportedOperations.find(op => 
          op.protocol === item.protocol)?.contractAddress,
        functionName: getFunctionName(item.protocol, item.product)
      }));
      
      setExecutionStep(3);
      
      // Execute operations
      const result = await executeOperations(wallet.address, operations, recommendation.totalInvestment);
      
      setOperationResults(result.operations || []);
      
      if (result.success) {
        setExecutionStep(5);
        showNotification('Strategy executed successfully!', 'success');
      } else {
        setExecutionStep(4);
        setError(`Some operations failed: ${result.failed?.length || 0} of ${operations.length}`);
        showNotification('Some operations failed during execution', 'warning');
      }
      
      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      setError(`Execution failed: ${err.message}`);
      showNotification(`Strategy execution failed: ${err.message}`, 'error');
    } finally {
      setIsExecuting(false);
    }
  };
  
  // Helper function to determine function name based on protocol and product
  const getFunctionName = (protocol, product) => {
    const lowerProtocol = protocol.toLowerCase();
    const lowerProduct = product.toLowerCase();
    
    if (lowerProduct.includes('staking')) {
      return lowerProtocol === 'thala' ? '::staking::stake_apt' : '::staking::stake';
    } else if (lowerProduct.includes('lending')) {
      return '::lending::supply';
    } else if (lowerProduct.includes('liquidity')) {
      return '::router::add_liquidity';
    }
    
    return '::execute';
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4">Execute Recommendation</h2>
      
      <div className="mb-6">
        <h3 className="font-medium mb-2">Strategy Summary</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">{recommendation.summary}</p>
        
        <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-md mb-4">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Total Investment:</span>
            <span className="font-medium">{formatCurrency(recommendation.totalInvestment, 'APT')}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600 dark:text-gray-300">Expected APR:</span>
            <span className="font-medium text-green-600">{recommendation.totalApr}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600 dark:text-gray-300">Estimated Gas:</span>
            <span className="font-medium">{formatCurrency(estimatedGas, 'APT')}</span>
          </div>
        </div>
        
        <h3 className="font-medium mb-2">Asset Allocation</h3>
        <div className="overflow-auto max-h-60">
          <table className="min-w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Protocol</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Product</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Amount</th>
                <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
              {recommendation.allocation.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-4 py-2 text-sm">{item.protocol}</td>
                  <td className="px-4 py-2 text-sm">{item.product}</td>
                  <td className="px-4 py-2 text-sm text-right">{formatCurrency(item.amount, 'APT')}</td>
                  <td className="px-4 py-2 text-sm text-right text-green-600">{item.expectedApr}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isExecuting && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Execution Progress</h3>
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${(executionStep / (steps.length - 1)) * 100}%` }}
            ></div>
          </div>
          <div className="flex items-center justify-center">
            <Spinner size="small" />
            <span className="ml-2">{steps[executionStep]}</span>
          </div>
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-md mb-6">
          <p className="text-sm">{error}</p>
        </div>
      )}
      
      {operationResults.length > 0 && (
        <div className="mb-6">
          <h3 className="font-medium mb-2">Transaction Results</h3>
          <div className="overflow-auto max-h-60">
            <table className="min-w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Protocol</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Operation</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-500 dark:text-gray-300">Status</th>
                  <th className="px-4 py-2 text-right text-sm font-medium text-gray-500 dark:text-gray-300">Tx Hash</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                {operationResults.map((result, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-4 py-2 text-sm">{result.protocol}</td>
                    <td className="px-4 py-2 text-sm">{result.operation}</td>
                    <td className="px-4 py-2 text-sm">
                      <span className={`inline-flex px-2 py-1 text-xs rounded-full ${
                        result.status === 'success' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' 
                          : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                      }`}>
                        {result.status}
                      </span>
                    </td>
                    <td className="px-4 py-2 text-sm text-right">
                      {result.transactionHash && (
                        <a 
                          href={`https://explorer.aptoslabs.com/txn/${result.transactionHash}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                          {shortenAddress(result.transactionHash)}
                        </a>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-4">
        <Button 
          variant="secondary" 
          onClick={onCancel}
          disabled={isExecuting}
        >
          Cancel
        </Button>
        <Button 
          variant="primary" 
          onClick={handleExecute}
          disabled={isExecuting || !wallet.connected}
        >
          {isExecuting ? 'Executing...' : 'Execute Strategy'}
        </Button>
      </div>
    </div>
  );
};

export default RecommendationExecution;