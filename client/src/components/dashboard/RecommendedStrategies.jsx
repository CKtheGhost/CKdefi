import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { useWalletContext } from '../../context/WalletContext';
import { Link } from 'react-router-dom';

const RecommendedStrategies = ({ stakingData }) => {
  const { walletConnected } = useWalletContext();
  const { portfolioData } = useData();
  const [selectedStrategy, setSelectedStrategy] = useState('balanced');

  if (!stakingData || !stakingData.strategies) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Recommended Strategies</h2>
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  const strategies = stakingData.strategies;
  const strategy = strategies[selectedStrategy] || strategies.balanced;
  
  const availableStrategies = [
    { id: 'conservative', name: 'Conservative', riskLevel: 'Low' },
    { id: 'balanced', name: 'Balanced', riskLevel: 'Medium' },
    { id: 'aggressive', name: 'Aggressive', riskLevel: 'High' },
    { id: 'yield_optimizer', name: 'Yield Optimizer', riskLevel: 'Medium-High' }
  ];

  // Format APR to always show 2 decimal places
  const formatApr = (apr) => {
    return parseFloat(apr).toFixed(2);
  };

  // Get appropriate background color based on risk level
  const getRiskBadgeColor = (riskLevel) => {
    switch (riskLevel) {
      case 'Low':
        return 'bg-green-900 text-green-300';
      case 'Medium':
        return 'bg-yellow-900 text-yellow-300';
      case 'Medium-High':
        return 'bg-orange-900 text-orange-300';
      case 'High':
        return 'bg-red-900 text-red-300';
      default:
        return 'bg-blue-900 text-blue-300';
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Recommended Strategies</h2>
        <Link 
          to="/ai-recommendations" 
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          <span>Get Personalized Strategy</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="mb-6">
        <div className="flex flex-wrap gap-2 mb-4">
          {availableStrategies.map((strat) => (
            <button
              key={strat.id}
              onClick={() => setSelectedStrategy(strat.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${selectedStrategy === strat.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
            >
              {strat.name}
            </button>
          ))}
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">{strategy.name}</h3>
              <div className="flex items-center mt-1">
                <span className={`text-xs px-2 py-1 rounded-full ${getRiskBadgeColor(strategy.riskLevel)}`}>
                  {strategy.riskLevel} Risk
                </span>
                <span className="ml-3 text-green-400 font-medium">
                  {formatApr(strategy.apr)}% APR
                </span>
              </div>
            </div>
            {walletConnected && (
              <Link
                to="/ai-recommendations"
                className="bg-blue-600 hover:bg-blue-700 text-sm text-white px-3 py-1 rounded"
              >
                Apply Strategy
              </Link>
            )}
          </div>
          
          <p className="text-gray-300 mb-4">{strategy.description}</p>
          
          <h4 className="text-sm font-medium text-gray-400 mb-2">Allocation</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {strategy.allocation.map((item, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">{item.protocol}</td>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">{item.type}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{item.percentage}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-indigo-900 to-blue-900 rounded-lg p-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-white mb-1">Ready for a personalized strategy?</h3>
          <p className="text-blue-200">
            Get AI-powered recommendations based on your wallet and market conditions
          </p>
        </div>
        <Link
          to="/ai-recommendations"
          className="bg-white text-blue-800 hover:bg-blue-100 px-4 py-2 rounded-lg font-medium"
        >
          Get Started
        </Link>
      </div>
    </div>
  );
};

export default RecommendedStrategies;