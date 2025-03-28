import React, { useState, useEffect } from 'react';
import { 
  Chart as ChartJS, 
  ArcElement, 
  Tooltip, 
  Legend, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Button from '../common/Button';
import Card from '../common/Card';
import { formatNumber } from '../../utils/formatters';

// Register ChartJS components
ChartJS.register(
  ArcElement, 
  Tooltip, 
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

const RecommendationResult = ({ recommendation, onExecute, onBack, isConnected }) => {
  const [activeTab, setActiveTab] = useState('allocation');
  
  // Return early if no recommendation
  if (!recommendation || !recommendation.allocation) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No recommendation data available.</p>
        {onBack && (
          <Button onClick={onBack} variant="outline" className="mt-4">
            Go Back
          </Button>
        )}
      </div>
    );
  }
  
  // Prepare chart colors
  const chartColors = [
    '#3b82f6', // blue-500
    '#10b981', // green-500
    '#8b5cf6', // purple-500
    '#f59e0b', // amber-500
    '#ef4444', // red-500
    '#ec4899', // pink-500
    '#06b6d4', // cyan-500
    '#14b8a6', // teal-500
    '#6366f1', // indigo-500
    '#84cc16', // lime-500
  ];
  
  // Prepare chart data
  const pieChartData = {
    labels: recommendation.allocation.map(item => `${item.protocol} (${item.percentage}%)`),
    datasets: [
      {
        data: recommendation.allocation.map(item => item.percentage),
        backgroundColor: chartColors,
        borderWidth: 0,
      },
    ],
  };
  
  const aprChartData = {
    labels: recommendation.allocation.map(item => item.protocol),
    datasets: [
      {
        label: 'Expected APR (%)',
        data: recommendation.allocation.map(item => item.expectedApr || 0),
        backgroundColor: '#3b82f6',
      },
    ],
  };
  
  // Generate risk description based on profile
  const getRiskDescription = () => {
    const riskProfile = recommendation.riskProfile?.toLowerCase() || 'balanced';
    
    switch(riskProfile) {
      case 'conservative':
        return 'This strategy focuses on capital preservation with stable yields. It prioritizes lower volatility investments and established protocols.';
      case 'aggressive':
        return 'This strategy aims for maximum returns with higher volatility. It includes newer protocols and more complex investment strategies.';
      case 'yield_optimizer':
        return 'This strategy uses advanced techniques to maximize yield through auto-compounding and strategic rebalancing.';
      case 'stablecoin_yield':
        return 'This strategy focuses on generating yield from stablecoin protocols while minimizing exposure to cryptocurrency volatility.';
      case 'balanced':
      default:
        return 'This strategy balances risk and reward for sustainable long-term growth, diversifying across different protocol types.';
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">
                {recommendation.title || 'AI Investment Strategy'}
              </h2>
              <p className="text-gray-400 mt-1">
                {recommendation.riskProfile && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium mr-2 bg-blue-900 text-blue-200">
                    {recommendation.riskProfile.charAt(0).toUpperCase() + recommendation.riskProfile.slice(1)}
                  </span>
                )}
                {recommendation.timestamp && (
                  <span className="text-sm">Generated {new Date(recommendation.timestamp).toLocaleString()}</span>
                )}
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-blue-400">{recommendation.totalApr || 0}%</div>
              <div className="text-sm text-gray-400">Expected APR</div>
            </div>
          </div>
          
          <p className="text-gray-300 mb-6">
            {recommendation.summary || getRiskDescription()}
          </p>
          
          <div className="flex space-x-4">
            <Button
              onClick={onExecute}
              disabled={!isConnected}
              variant="primary"
            >
              Execute Strategy
            </Button>
            {onBack && (
              <Button
                onClick={onBack}
                variant="outline"
              >
                Back
              </Button>
            )}
          </div>
        </div>
      </Card>
      
      {/* Tabs Navigation */}
      <div className="border-b border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('allocation')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'allocation'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Allocation
          </button>
          <button
            onClick={() => setActiveTab('risks')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'risks'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Risks & Mitigations
          </button>
          <button
            onClick={() => setActiveTab('steps')}
            className={`py-4 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'steps'
                ? 'border-blue-500 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
            }`}
          >
            Implementation Steps
          </button>
        </nav>
      </div>
      
      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'allocation' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Allocation Table */}
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Allocation Strategy</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-700">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">APR</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-700">
                      {recommendation.allocation.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-750'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.protocol}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.product || 'Staking'}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.percentage}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {item.amount ? `${item.amount} APT` : '-'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{item.expectedApr || 0}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </Card>
            
            {/* Allocation Charts */}
            <div className="grid grid-cols-1 gap-6">
              <Card className="bg-gray-800 border border-gray-700">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Allocation By Protocol</h3>
                  <div className="h-64">
                    <Pie 
                      data={pieChartData} 
                      options={{
                        plugins: {
                          legend: {
                            position: 'right',
                            labels: {
                              color: 'rgb(209, 213, 219)',
                              font: {
                                size: 11
                              }
                            }
                          }
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>
              </Card>
              
              <Card className="bg-gray-800 border border-gray-700">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Expected APR By Protocol</h3>
                  <div className="h-64">
                    <Bar 
                      data={aprChartData}
                      options={{
                        plugins: {
                          legend: {
                            display: false
                          }
                        },
                        scales: {
                          y: {
                            beginAtZero: true,
                            grid: {
                              color: 'rgba(75, 85, 99, 0.2)'
                            },
                            ticks: {
                              color: 'rgb(209, 213, 219)'
                            }
                          },
                          x: {
                            grid: {
                              color: 'rgba(75, 85, 99, 0.2)'
                            },
                            ticks: {
                              color: 'rgb(209, 213, 219)'
                            }
                          }
                        },
                        maintainAspectRatio: false
                      }}
                    />
                  </div>
                </div>
              </Card>
            </div>
          </div>
        )}
        
        {activeTab === 'risks' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Risks */}
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Potential Risks</h3>
                {recommendation.risks && recommendation.risks.length > 0 ? (
                  <ul className="space-y-2">
                    {recommendation.risks.map((risk, index) => (
                      <li key={index} className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{risk}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Smart contract risk - protocols may have vulnerabilities</span>
                    </div>
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Market volatility - APT price fluctuations impact returns</span>
                    </div>
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Yield variability - APRs may decrease over time</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Mitigations */}
            <Card className="bg-gray-800 border border-gray-700">
              <div className="p-4">
                <h3 className="text-lg font-semibold text-white mb-4">Risk Mitigations</h3>
                {recommendation.mitigations && recommendation.mitigations.length > 0 ? (
                  <ul className="space-y-2">
                    {recommendation.mitigations.map((mitigation, index) => (
                      <li key={index} className="flex">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-300">{mitigation}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="space-y-2">
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Diversification across multiple protocols</span>
                    </div>
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Focus on audited protocols with security track records</span>
                    </div>
                    <div className="flex">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-300">Regular rebalancing to optimize returns</span>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
            {/* Additional Notes */}
            {recommendation.additionalNotes && (
              <Card className="bg-gray-800 border border-gray-700 lg:col-span-2">
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-white mb-4">Additional Insights</h3>
                  <p className="text-gray-300">{recommendation.additionalNotes}</p>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {activeTab === 'steps' && (
          <Card className="bg-gray-800 border border-gray-700">
            <div className="p-4">
              <h3 className="text-lg font-semibold text-white mb-4">Implementation Steps</h3>
              {recommendation.steps && recommendation.steps.length > 0 ? (
                <ol className="space-y-4">
                  {recommendation.steps.map((step, index) => (
                    <li key={index} className="flex">
                      <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                        {index + 1}
                      </div>
                      <span className="text-gray-300">{step}</span>
                    </li>
                  ))}
                </ol>
              ) : (
                <ol className="space-y-4">
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                      1
                    </div>
                    <span className="text-gray-300">Connect your wallet to CompounDefi</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                      2
                    </div>
                    <span className="text-gray-300">Review and approve the recommended allocation strategy</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                      3
                    </div>
                    <span className="text-gray-300">Click "Execute Strategy" to start the allocation process</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                      4
                    </div>
                    <span className="text-gray-300">Confirm each transaction in your wallet when prompted</span>
                  </li>
                  <li className="flex">
                    <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-900 text-blue-200 text-sm font-medium mr-4">
                      5
                    </div>
                    <span className="text-gray-300">Monitor your portfolio in the dashboard</span>
                  </li>
                </ol>
              )}
              
              <div className="mt-6 pt-6 border-t border-gray-700">
                <h4 className="font-medium text-gray-300 mb-2">Ready to implement?</h4>
                <p className="text-gray-400 text-sm mb-4">
                  Click "Execute Strategy" to automatically implement this recommendation with your connected wallet.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={onExecute}
                  disabled={!isConnected}
                >
                  Execute Strategy
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default RecommendationResult;