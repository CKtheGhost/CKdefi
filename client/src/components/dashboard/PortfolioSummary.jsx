// PortfolioSummary.jsx - Portfolio summary component for dashboard

import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency, formatPercentage, formatDate } from '../../utils/formatters';

const PortfolioSummary = ({ portfolioData, loading, error }) => {
  // If error occurred
  if (error) {
    return (
      <div className="bg-white dark:bg-dark-lighter p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="text-center py-4">
          <div className="flex items-center justify-center text-red-500 mb-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <span className="font-medium">Error loading portfolio</span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-3 inline-flex items-center px-3 py-1.5 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  // If loading or no data yet
  if (loading || !portfolioData) {
    return (
      <div className="bg-white dark:bg-dark-lighter p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 animate-pulse">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="h-7 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-3"></div>
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-3"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Calculate protocol distribution percentages for the pie chart
  const getProtocolDistribution = () => {
    const total = portfolioData.totalValueUSD || 0;
    const aptValue = portfolioData.apt?.valueUSD || 0;
    const stakedValue = portfolioData.stakedTokens?.valueUSD || 0;
    const liquidityValue = portfolioData.liquidity?.estimatedValueUSD || 0;
    
    return [
      { name: 'Native APT', value: aptValue, percentage: (aptValue / total) * 100 },
      { name: 'Staked APT', value: stakedValue, percentage: (stakedValue / total) * 100 },
      { name: 'Liquidity', value: liquidityValue, percentage: (liquidityValue / total) * 100 }
    ];
  };

  const protocolDistribution = getProtocolDistribution();
  
  // Get 24h change (placeholder for now)
  const dailyChange = 1.25; // Placeholder value, would come from API
  const isPositiveChange = dailyChange >= 0;

  return (
    <div className="bg-white dark:bg-dark-lighter p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Total value section */}
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Portfolio Value</h2>
          <div className="flex items-baseline mt-1">
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(portfolioData.totalValueUSD)}
            </span>
            <span className={`ml-2 text-sm font-medium ${isPositiveChange ? 'text-green-500' : 'text-red-500'}`}>
              {isPositiveChange ? '+' : ''}{formatPercentage(dailyChange, 2)} (24h)
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            Last updated: {formatDate(portfolioData.lastUpdated, 'relative')}
          </p>
        </div>
        
        {/* Portfolio stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* APT Balance */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">APT Balance</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {portfolioData.apt?.formatted || '0 APT'}
            </p>
          </div>
          
          {/* Staked APT */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Staked APT</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {portfolioData.stakedTokens?.totalStakedFormatted || '0 APT'}
            </p>
          </div>
          
          {/* APT Price */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">APT Price</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(portfolioData.aptPrice || 0)}
            </p>
          </div>
          
          {/* Active Positions */}
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
            <h3 className="text-xs font-medium text-gray-500 dark:text-gray-400">Active Positions</h3>
            <p className="mt-1 text-lg font-semibold text-gray-900 dark:text-white">
              {/* Count active staking positions and liquidity positions */}
              {Object.keys(portfolioData.stakedTokens?.tokens || {}).filter(key => 
                portfolioData.stakedTokens.tokens[key].value > 0
              ).length + (portfolioData.liquidity?.positions?.length || 0)}
            </p>
          </div>
        </div>
      </div>
      
      {/* Protocol distribution section */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Portfolio Distribution</h3>
          <Link to="/wallet" className="text-xs text-primary hover:text-primary-dark dark:hover:text-primary-light">
            View Details
          </Link>
        </div>
        
        <div className="space-y-2">
          {protocolDistribution.map((item, index) => (
            <div key={index} className="flex items-center">
              <div className="w-full flex-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {formatPercentage(item.percentage, 1)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      index === 0 ? 'bg-blue-500' : 
                      index === 1 ? 'bg-green-500' : 
                      'bg-purple-500'
                    }`}
                    style={{ width: `${Math.max(item.percentage, 0.5)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioSummary;