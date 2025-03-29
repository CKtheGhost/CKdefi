import React, { useState } from 'react';
import { usePortfolio } from '../../hooks/usePortfolio';
import { useWallet } from '../../hooks/useWallet';
import { formatCurrency, formatPercentage } from '../../utils/formatters';

const StakedAssets = () => {
  const { portfolio, loading } = usePortfolio();
  const { connectWallet, isConnected } = useWallet();
  const [sortField, setSortField] = useState('valueUSD');
  const [sortDirection, setSortDirection] = useState('desc');

  if (!isConnected) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Staked Assets</h2>
        <div className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">Connect your wallet to view your staked assets</p>
          <button 
            onClick={connectWallet}
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Staked Assets</h2>
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  // Extract staked positions
  const stakedPositions = [
    portfolio?.stAPT?.amount > 0 && { 
      protocol: 'Amnis Finance', 
      token: 'stAPT', 
      amount: parseFloat(portfolio.stAPT.amount), 
      valueUSD: parseFloat(portfolio.stAPT.valueUSD),
      apy: 7.8, // These would come from the staking data in a real implementation
      unstakeEnabled: true
    },
    portfolio?.sthAPT?.amount > 0 && { 
      protocol: 'Thala Labs', 
      token: 'sthAPT', 
      amount: parseFloat(portfolio.sthAPT.amount), 
      valueUSD: parseFloat(portfolio.sthAPT.valueUSD),
      apy: 8.2,
      unstakeEnabled: true
    },
    portfolio?.tAPT?.amount > 0 && { 
      protocol: 'Tortuga Finance', 
      token: 'tAPT', 
      amount: parseFloat(portfolio.tAPT.amount), 
      valueUSD: parseFloat(portfolio.tAPT.valueUSD),
      apy: 7.9,
      unstakeEnabled: true
    },
    portfolio?.dAPT?.amount > 0 && { 
      protocol: 'Ditto', 
      token: 'dAPT', 
      amount: parseFloat(portfolio.dAPT.amount), 
      valueUSD: parseFloat(portfolio.dAPT.valueUSD),
      apy: 7.5,
      unstakeEnabled: true
    }
  ].filter(Boolean);

  // Handle empty state
  if (stakedPositions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Staked Assets</h2>
        <div className="text-center py-6">
          <p className="text-gray-600 dark:text-gray-400 mb-4">You don't have any staked assets yet</p>
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
            onClick={() => window.location.href = '/recommendations'}
          >
            Get Staking Recommendations
          </button>
        </div>
      </div>
    );
  }

  // Sort positions
  const sortedPositions = [...stakedPositions].sort((a, b) => {
    if (sortDirection === 'asc') {
      return a[sortField] - b[sortField];
    } else {
      return b[sortField] - a[sortField];
    }
  });

  // Calculate totals
  const totalStaked = stakedPositions.reduce((sum, pos) => sum + pos.valueUSD, 0);
  const weightedApy = stakedPositions.reduce((sum, pos) => 
    sum + (pos.apy * (pos.valueUSD / totalStaked)), 0);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleUnstake = (token, amount) => {
    // This would be implemented in a real app
    console.log(`Unstaking ${amount} ${token}`);
    // Show transaction modal
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Staked Assets</h2>
        <div className="text-right">
          <p className="text-sm text-gray-600 dark:text-gray-400">Total Staked Value</p>
          <p className="text-lg font-semibold text-gray-800 dark:text-white">{formatCurrency(totalStaked)}</p>
          <p className="text-sm text-green-600 dark:text-green-400">
            Avg. APY: {formatPercentage(weightedApy)}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('protocol')}
              >
                Protocol / Token
                {sortField === 'protocol' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('amount')}
              >
                Amount
                {sortField === 'amount' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('valueUSD')}
              >
                Value
                {sortField === 'valueUSD' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th 
                scope="col" 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('apy')}
              >
                APY
                {sortField === 'apy' && (
                  <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                )}
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {sortedPositions.map((position, index) => (
              <tr key={index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {position.protocol}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {position.token}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {position.amount.toFixed(4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                  {formatCurrency(position.valueUSD)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                    {formatPercentage(position.apy)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleUnstake(position.token, position.amount)}
                    disabled={!position.unstakeEnabled}
                    className={`text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-300 ${!position.unstakeEnabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    Unstake
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StakedAssets;