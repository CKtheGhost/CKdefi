import React from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';

const LiquidityPositions = ({ className = "" }) => {
  const { portfolio, isLoading } = usePortfolio();

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Liquidity Positions</h3>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
        </div>
      </div>
    );
  }

  const hasLiquidity = portfolio?.ammLiquidity?.hasLiquidity;
  const positions = portfolio?.ammLiquidity?.positions || [];
  const totalValue = parseFloat(portfolio?.ammLiquidity?.estimatedValueUSD || 0);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-lg">Liquidity Positions</h3>
        {hasLiquidity && (
          <span className="text-blue-500 font-medium">${totalValue.toFixed(2)}</span>
        )}
      </div>

      {!hasLiquidity ? (
        <div className="text-center py-6">
          <p className="text-gray-500 dark:text-gray-400">No liquidity positions found</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">Add liquidity to AMMs to earn trading fees</p>
        </div>
      ) : (
        <div className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Protocol
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Pool
                  </th>
                  <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Value
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {positions.map((position, index) => (
                  <tr key={index}>
                    <td className="px-3 py-2 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                      {position.protocol.charAt(0).toUpperCase() + position.protocol.slice(1)}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      {position.poolType || position.pairName || 'LP Token'}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-500 dark:text-gray-400">
                      ${parseFloat(position.valueUSD).toFixed(2)}
                    </td>
                  </tr>
                ))}
                {positions.length === 0 && (
                  <tr>
                    <td colSpan="3" className="px-3 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
                      Liquidity detected, but details unavailable
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600 dark:text-gray-400">Estimated APR:</span>
              <span className="font-medium text-green-600 dark:text-green-400">
                {portfolio?.ammLiquidity?.apr ? `${portfolio.ammLiquidity.apr.toFixed(2)}%` : 'Varies by pool'}
              </span>
            </div>
            <div className="flex justify-between text-sm mt-1">
              <span className="text-gray-600 dark:text-gray-400">Total Value:</span>
              <span className="font-medium">${totalValue.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiquidityPositions;