// src/components/wallet/StakedAssets.jsx

import React from 'react';
import { formatNumber } from '../../utils/formatters';

const StakedAssets = ({ portfolioData }) => {
  const stakedTokens = [
    { 
      key: 'stAPT', 
      name: 'Amnis stAPT', 
      protocol: 'amnis', 
      logo: '/assets/images/protocols/amnis.png',
      color: 'blue'
    },
    { 
      key: 'sthAPT', 
      name: 'Thala sthAPT', 
      protocol: 'thala',
      logo: '/assets/images/protocols/thala.png',
      color: 'purple'
    },
    { 
      key: 'tAPT', 
      name: 'Tortuga tAPT', 
      protocol: 'tortuga',
      logo: '/assets/images/protocols/tortuga.png',
      color: 'green'
    },
    { 
      key: 'dAPT', 
      name: 'Ditto dAPT', 
      protocol: 'ditto',
      logo: '/assets/images/protocols/ditto.png',
      color: 'yellow'
    }
  ];
  
  // Check if user has any staked assets
  const hasStakedAssets = stakedTokens.some(token => 
    portfolioData && portfolioData[token.key] && parseFloat(portfolioData[token.key].amount) > 0
  );
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Staked Assets</h3>
      
      {!hasStakedAssets ? (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">No staked assets found in this wallet</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
            Explore Staking Options
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">
                  Asset
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Value
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  APR
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-gray-700 divide-y divide-gray-600 rounded-b-lg">
              {stakedTokens.map(token => {
                const tokenData = portfolioData && portfolioData[token.key];
                if (!tokenData || parseFloat(tokenData.amount) <= 0) return null;
                
                return (
                  <tr key={token.key}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-8 h-8 rounded-full bg-${token.color}-100 flex items-center justify-center mr-3`}>
                          <img 
                            src={token.logo} 
                            alt={token.name} 
                            className="w-6 h-6"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = token.name.substring(0, 1);
                            }}
                          />
                        </div>
                        <div>
                          <div className="text-sm font-medium text-white">{token.name}</div>
                          <div className="text-xs text-gray-400">{token.protocol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">{tokenData.amount}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">${formatNumber(tokenData.valueUSD)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-400">{tokenData.apr || '7.5'}%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Stake More
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Unstake
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StakedAssets;