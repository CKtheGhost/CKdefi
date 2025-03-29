import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { CheckCircleIcon, XCircleIcon, ClockIcon, ArrowUpCircleIcon, ArrowDownCircleIcon } from 'lucide-react';
import { formatDate, formatTime, shortenAddress } from '../../utils/formatters';

const ExecutionHistory = () => {
  const { address } = useWallet();
  const [rebalanceHistory, setRebalanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!address) return;

    const fetchRebalanceHistory = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/auto-rebalance/history?walletAddress=${address}`);
        if (!response.ok) {
          throw new Error('Failed to fetch rebalance history');
        }
        const data = await response.json();
        setRebalanceHistory(data.history || []);
      } catch (err) {
        console.error('Error fetching rebalance history:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRebalanceHistory();
  }, [address]);

  // Helper to get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'failed':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      case 'pending':
      case 'in_progress':
        return <ClockIcon className="h-5 w-5 text-yellow-500 animate-pulse" />;
      case 'partial':
        return <CheckCircleIcon className="h-5 w-5 text-yellow-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-500" />;
    }
  };

  // Helper to get operation type icon
  const getOperationIcon = (type) => {
    if (type === 'stake' || type === 'lend' || type === 'addLiquidity' || type === 'deposit') {
      return <ArrowUpCircleIcon className="h-4 w-4 text-green-500" />;
    } else if (type === 'unstake' || type === 'withdraw' || type === 'removeLiquidity') {
      return <ArrowDownCircleIcon className="h-4 w-4 text-red-500" />;
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800 animate-pulse">
        <h2 className="text-xl font-bold mb-4">Execution History</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">Loading history...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4">Execution History</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-red-500">Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg bg-white p-6 shadow-md dark:bg-gray-800">
      <h2 className="text-xl font-bold mb-4">Execution History</h2>
      
      {rebalanceHistory.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-gray-500 dark:text-gray-400">No rebalancing history found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Operations
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {rebalanceHistory.map((event, index) => (
                <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div>{formatDate(event.timestamp)}</div>
                    <div className="text-xs text-gray-500">{formatTime(event.timestamp)}</div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div className="flex items-center">
                      {getStatusIcon(event.status)}
                      <span className="ml-2 capitalize">{event.status}</span>
                    </div>
                    {event.duration && (
                      <div className="text-xs text-gray-500">
                        {(event.duration / 1000).toFixed(1)}s
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    <div>
                      {event.successfulOperations || 0} successful / {event.failedOperations || 0} failed
                    </div>
                    {event.operations && event.operations.length > 0 && (
                      <div className="mt-1 text-xs text-gray-500">
                        {event.operations.slice(0, 2).map((op, i) => (
                          <div key={i} className="flex items-center">
                            {getOperationIcon(op.type)}
                            <span className="ml-1">
                              {op.amount} APT ({op.protocol})
                            </span>
                          </div>
                        ))}
                        {event.operations.length > 2 && (
                          <div className="text-xs italic">+ {event.operations.length - 2} more</div>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm">
                    {event.performanceMetrics ? (
                      <div>
                        <span 
                          className={
                            event.performanceMetrics.percentChange > 0 
                              ? 'text-green-500' 
                              : event.performanceMetrics.percentChange < 0 
                                ? 'text-red-500' 
                                : ''
                          }
                        >
                          {event.performanceMetrics.percentChange > 0 ? '+' : ''}
                          {event.performanceMetrics.percentChange.toFixed(2)}%
                        </span>
                        {event.performanceMetrics.valueDifference && (
                          <div className="text-xs text-gray-500">
                            ${Math.abs(event.performanceMetrics.valueDifference).toFixed(2)}
                          </div>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-500">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {rebalanceHistory.length > 0 && (
        <div className="mt-4 flex justify-center">
          <a 
            href={`/optimizer/history?address=${address}`} 
            className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            View full history
          </a>
        </div>
      )}
    </div>
  );
};

export default ExecutionHistory;