import React from 'react';
import { formatDistanceToNow } from 'date-fns';

/**
 * Component to display historical auto-optimizer execution records
 * 
 * @param {Object} props
 * @param {Array} props.history - Array of execution history records
 */
const ExecutionHistory = ({ history = [] }) => {
  if (!history || history.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
        <h2 className="text-xl font-bold text-white mb-4">Execution History</h2>
        <div className="text-center py-6">
          <p className="text-gray-400">No execution history yet</p>
          <p className="text-gray-500 text-sm mt-2">
            Auto-optimization events will appear here once executed
          </p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Unknown date';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Execution History</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {history.map((record, index) => (
          <div 
            key={index} 
            className="bg-gray-700 rounded-lg p-4 border border-gray-600"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                  record.action === 'rebalanced' 
                    ? record.success !== false 
                      ? 'bg-green-900/50 text-green-400' 
                      : 'bg-yellow-900/50 text-yellow-400'
                    : 'bg-blue-900/50 text-blue-400'
                }`}>
                  {record.action === 'rebalanced' 
                    ? record.success !== false 
                      ? 'Rebalanced' 
                      : 'Partial Rebalance'
                    : record.action === 'skipped' 
                      ? 'Skipped' 
                      : record.action}
                </span>
              </div>
              <span className="text-gray-400 text-xs">{formatDate(record.date)}</span>
            </div>
            
            {record.reason && (
              <p className="text-gray-300 text-sm mt-1">{record.reason}</p>
            )}
            
            {record.action === 'rebalanced' && (
              <div className="mt-2 text-sm">
                <div className="text-gray-400">
                  Operations: 
                  <span className="text-white ml-1">
                    {record.successfulOperations || record.operations || 0} successful
                  </span>
                  {record.failedOperations > 0 && (
                    <span className="text-red-400 ml-1">
                      {record.failedOperations} failed
                    </span>
                  )}
                </div>
                
                {record.driftAnalysis && (
                  <div className="text-gray-400 mt-1">
                    Max Drift: <span className="text-white">{record.driftAnalysis.maxDrift?.toFixed(2) || '0'}%</span>
                  </div>
                )}
              </div>
            )}
            
            {record.operations && record.operations.length > 0 && (
              <div className="mt-2">
                <details className="text-xs">
                  <summary className="text-blue-400 cursor-pointer">View details</summary>
                  <div className="mt-2 pl-2 border-l border-gray-600 space-y-2">
                    {record.operations.map((op, opIndex) => (
                      <div key={opIndex} className="text-gray-300">
                        {op.type || 'Operation'} {op.amount} APT on {op.protocol}
                      </div>
                    ))}
                  </div>
                </details>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExecutionHistory;