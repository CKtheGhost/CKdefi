import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { formatAddress, formatCurrency } from '../../utils/formatters';
import { Button } from '../common/Button';
import { Tooltip } from '../common/Tooltip';
import { Spinner } from '../common/Spinner';

const WalletHeader = ({ portfolioData, isLoading }) => {
  const { wallet, disconnectWallet, refreshPortfolio } = useWallet();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refreshPortfolio();
    setIsRefreshing(false);
  };

  // Calculate portfolio values
  const totalValue = portfolioData?.totalValueUSD || 0;
  const aptBalance = parseFloat(portfolioData?.apt?.amount || 0);
  const stakedBalance = 
    parseFloat(portfolioData?.stAPT?.amount || 0) + 
    parseFloat(portfolioData?.sthAPT?.amount || 0) + 
    parseFloat(portfolioData?.tAPT?.amount || 0) + 
    parseFloat(portfolioData?.dAPT?.amount || 0);
  const liquidityValue = portfolioData?.ammLiquidity?.estimatedValueUSD || 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Wallet Overview
                </h2>
                <Tooltip content="Your connected wallet and portfolio summary">
                  <span className="text-gray-400 cursor-help">
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-5 w-5" 
                      viewBox="0 0 20 20" 
                      fill="currentColor"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" 
                        clipRule="evenodd" 
                      />
                    </svg>
                  </span>
                </Tooltip>
              </div>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-medium mr-2">
                  {formatAddress(wallet?.address)}
                </span>
                <button 
                  onClick={() => {
                    if (navigator.clipboard) {
                      navigator.clipboard.writeText(wallet?.address);
                    }
                  }}
                  className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path d="M8 3a1 1 0 011-1h2a1 1 0 110 2H9a1 1 0 01-1-1z" />
                    <path d="M6 3a2 2 0 00-2 2v11a2 2 0 002 2h8a2 2 0 002-2V5a2 2 0 00-2-2 3 3 0 01-3 3H9a3 3 0 01-3-3z" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex mt-4 md:mt-0">
              <Button 
                onClick={handleRefresh} 
                className="mr-2" 
                variant="outline" 
                disabled={isRefreshing}
              >
                {isRefreshing ? (
                  <Spinner size="sm" className="mr-1" />
                ) : (
                  <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className="h-4 w-4 mr-1" 
                    viewBox="0 0 20 20" 
                    fill="currentColor"
                  >
                    <path 
                      fillRule="evenodd" 
                      d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" 
                      clipRule="evenodd" 
                    />
                  </svg>
                )}
                Refresh
              </Button>
              <Button onClick={disconnectWallet} variant="secondary">
                Disconnect
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-2">
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Total Value</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(totalValue)}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">APT Balance</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {aptBalance.toFixed(4)} <span className="text-sm text-gray-500 dark:text-gray-400">APT</span>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">Staked Balance</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {stakedBalance.toFixed(4)} <span className="text-sm text-gray-500 dark:text-gray-400">APT</span>
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <h3 className="text-gray-500 dark:text-gray-300 text-sm font-medium">In Liquidity</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(liquidityValue)}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Last updated: {new Date(portfolioData?.lastUpdated || Date.now()).toLocaleString()}
            </h3>
          </div>
        </>
      )}
    </div>
  );
};

export default WalletHeader;