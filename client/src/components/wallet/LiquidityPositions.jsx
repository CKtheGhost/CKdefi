// src/components/wallet/LiquidityPositions.jsx

import React from 'react';
import { formatNumber } from '../../utils/formatters';

const LiquidityPositions = ({ portfolioData }) => {
  const ammLiquidity = portfolioData?.ammLiquidity || { hasLiquidity: false, positions: [] };
  const hasLiquidity = ammLiquidity.hasLiquidity;
  const positions = ammLiquidity.positions || [];
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h3 className="text-lg font-semibold text-white mb-4">Liquidity Positions</h3>
      
      {!hasLiquidity ? (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">No active liquidity positions found</p>
          <button className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded">
            Explore AMM Options
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider rounded-tl-lg">
                  Protocol
                </th>
                <th className="px-6 py-3 bg-gray-700 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  Pool
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
              {positions.length > 0 ? (
                positions.map((position, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                          <img 
                            src={`/assets/images/protocols/${position.protocol}.png`} 
                            alt={position.protocol} 
                            className="w-6 h-6"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              e.target.parentNode.innerHTML = position.protocol.substring(0, 1).toUpperCase();
                            }}
                          />
                        </div>
                        <div className="text-sm font-medium text-white capitalize">
                          {position.protocol}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">
                        {position.details?.tokenPair || position.type || 'LP Token'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-white">${formatNumber(position.valueUSD)}</div>
                      <div className="text-xs text-gray-400">{position.valueInApt} APT</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-green-400">~9.5%</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button className="text-blue-400 hover:text-blue-300 mr-3">
                        Add
                      </button>
                      <button className="text-red-400 hover:text-red-300">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                    {hasLiquidity ? 
                      `Total Liquidity: $${formatNumber(ammLiquidity.estimatedValueUSD)}` : 
                      'No detailed liquidity positions data available'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default LiquidityPositions;