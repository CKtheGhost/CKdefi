import React, { useState } from 'react';
import { 
  ArrowUpCircleIcon, 
  ArrowDownCircleIcon, 
  PlusCircleIcon, 
  MinusCircleIcon, 
  RefreshCcwIcon,
  ChevronDownIcon, 
  CheckIcon, 
  XIcon, 
  ClockIcon
} from 'lucide-react';

const StrategyOperations = ({ operations, executionStatus, onApprove, onReject }) => {
  const [expanded, setExpanded] = useState(true);

  // Helper to determine operation icon
  const getOperationIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'stake':
        return <ArrowUpCircleIcon className="h-5 w-5 text-blue-500" />;
      case 'unstake':
        return <ArrowDownCircleIcon className="h-5 w-5 text-orange-500" />;
      case 'lend':
        return <PlusCircleIcon className="h-5 w-5 text-green-500" />;
      case 'withdraw':
        return <MinusCircleIcon className="h-5 w-5 text-red-500" />;
      case 'addliquidity':
        return <PlusCircleIcon className="h-5 w-5 text-purple-500" />;
      case 'removeliquidity':
        return <MinusCircleIcon className="h-5 w-5 text-pink-500" />;
      default:
        return <RefreshCcwIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-pulse" />;
      default:
        return null;
    }
  };

  // Calculate the estimated gas cost (assuming APT as gas token)
  const totalGasCost = operations.reduce((total, op) => total + (op.estimatedGas || 0.001), 0);
  
  // Format operation type for display
  const formatOperationType = (type) => {
    // Convert camelCase to words with spacing and capitalization
    return type
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase());
  };

  if (!operations || operations.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No operations to display
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white shadow-md dark:bg-gray-800">
      <div 
        className="flex items-center justify-between p-6 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <h3 className="text-lg font-medium">Strategy Operations ({operations.length})</h3>
        <ChevronDownIcon 
          className={`h-5 w-5 transition-transform ${expanded ? 'transform rotate-180' : ''}`} 
        />
      </div>

      {expanded && (
        <div className="px-6 pb-6">
          <div className="mb-4 overflow-hidden rounded-lg border dark:border-gray-700">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Operation
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Protocol
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                {operations.map((operation, index) => (
                  <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      <div className="flex items-center">
                        {getOperationIcon(operation.type)}
                        <span className="ml-2">{formatOperationType(operation.type)}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {operation.protocol}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm">
                      {operation.amount} APT
                      {operation.amountUSD && (
                        <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                          (${parseFloat(operation.amountUSD).toFixed(2)})
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-sm text-right">
                      {getStatusIcon(operation.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mb-4 rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
            <div className="flex flex-wrap justify-between text-sm">
              <div>
                <p className="text-gray-500 dark:text-gray-400">Estimated Gas:</p>
                <p className="font-medium">{totalGasCost.toFixed(4)} APT</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Priority:</p>
                <p className="font-medium">Medium</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Max Slippage:</p>
                <p className="font-medium">2.0%</p>
              </div>
              <div>
                <p className="text-gray-500 dark:text-gray-400">Execution Time:</p>
                <p className="font-medium">~{operations.length * 15} sec</p>
              </div>
          </div>

          {executionStatus === 'pending' && (
            <div className="mt-6 flex justify-between">
              <button
                onClick={onReject}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
              >
                Reject
              </button>
              <button
                onClick={onApprove}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600"
              >
                Approve All Operations
              </button>
            </div>
          )}

          {executionStatus === 'executing' && (
            <div className="mt-4 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-blue-600 border-r-transparent"></div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Executing operations, please wait...
              </p>
            </div>
          )}

          {executionStatus === 'completed' && (
            <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-800 dark:bg-green-900/30 dark:text-green-400">
              <div className="flex">
                <CheckIcon className="h-5 w-5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    All operations completed successfully
                  </p>
                </div>
              </div>
            </div>
          )}

          {executionStatus === 'failed' && (
            <div className="mt-4 rounded-lg bg-red-50 p-4 text-red-800 dark:bg-red-900/30 dark:text-red-400">
              <div className="flex">
                <XIcon className="h-5 w-5 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm font-medium">
                    Some operations failed to execute
                  </p>
                  <p className="mt-1 text-xs">
                    Please check the status of individual operations above
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StrategyOperations;