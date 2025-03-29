import React, { useState } from 'react';
import { Card } from '../common/Card';
import { Tooltip } from '../common/Tooltip';
import AllocationChart from '../wallet/AllocationChart';
import { useWallet } from '../../hooks/useWallet';

const RecommendationResult = ({ recommendation, onExecute }) => {
  const { isConnected } = useWallet();
  const [showDetails, setShowDetails] = useState(false);

  if (!recommendation) return null;

  const { 
    title, 
    summary, 
    allocation = [], 
    totalApr, 
    risks = [], 
    mitigations = [], 
    steps = [] 
  } = recommendation;

  // Transform allocation data for the pie chart
  const allocationData = allocation.map(item => ({
    name: item.protocol,
    value: item.percentage,
    color: getProtocolColor(item.protocol),
    apr: item.expectedApr
  }));

  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            <div className="flex items-center mt-2">
              <span className="text-gray-600 dark:text-gray-300 text-sm">Expected APR:</span>
              <span className="ml-2 font-semibold text-green-600">{totalApr}%</span>
            </div>
            <p className="mt-3 text-gray-600 dark:text-gray-300">{summary}</p>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-semibold">Recommended Allocation</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Protocol</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Product</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Allocation</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">APR</th>
                    {recommendation.totalInvestment && (
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount (APT)</th>
                    )}
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {allocation.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white capitalize">{item.protocol}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.product}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.percentage}%</td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-green-600">{item.expectedApr}%</td>
                      {recommendation.totalInvestment && (
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{item.amount}</td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline text-sm font-medium"
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
            
            {showDetails && (
              <div className="mt-4 space-y-4">
                {steps.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Implementation Steps</h3>
                    <ol className="list-decimal pl-5 space-y-1">
                      {steps.map((step, index) => (
                        <li key={index} className="text-gray-600 dark:text-gray-300">{step}</li>
                      ))}
                    </ol>
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {risks.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Risks</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {risks.map((risk, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300">{risk}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {mitigations.length > 0 && (
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Risk Mitigations</h3>
                      <ul className="list-disc pl-5 space-y-1">
                        {mitigations.map((item, index) => (
                          <li key={index} className="text-gray-600 dark:text-gray-300">{item}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                
                {recommendation.additionalNotes && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Additional Notes</h3>
                    <p className="text-gray-600 dark:text-gray-300">{recommendation.additionalNotes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="w-full md:w-1/3 flex flex-col items-center">
          <div className="h-64 w-full">
            <AllocationChart data={allocationData} />
          </div>
          
          {isConnected && (
            <button
              onClick={() => onExecute(recommendation)}
              className="mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Execute Strategy
            </button>
          )}
          
          {!isConnected && (
            <Tooltip content="Connect your wallet to execute this strategy">
              <button
                disabled
                className="mt-4 w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 opacity-60 cursor-not-allowed"
              >
                Connect Wallet to Execute
              </button>
            </Tooltip>
          )}
        </div>
      </div>
    </Card>
  );
};

// Helper function to get consistent colors for protocols
function getProtocolColor(protocol) {
  const colorMap = {
    amnis: '#3b82f6',    // blue-500
    thala: '#8b5cf6',    // purple-500
    tortuga: '#10b981',  // emerald-500
    ditto: '#f59e0b',    // amber-500
    echo: '#ef4444',     // red-500
    aries: '#ec4899',    // pink-500
    pancakeswap: '#f97316', // orange-500
    liquidswap: '#14b8a6', // teal-500
    cetus: '#6366f1'     // indigo-500
  };
  
  return colorMap[protocol.toLowerCase()] || '#6b7280'; // gray-500 as default
}

export default RecommendationResult;