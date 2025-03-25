import React, { useEffect, useState } from 'react';
import { useWallet } from '../../context/WalletContext';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const PortfolioSummary = () => {
  const { walletAddress } = useWallet();
  const { portfolioData, loadingPortfolio, fetchWalletData } = useData();
  const [chartInitialized, setChartInitialized] = useState(false);

  useEffect(() => {
    if (walletAddress && !portfolioData) {
      fetchWalletData(walletAddress);
    }
  }, [walletAddress, portfolioData, fetchWalletData]);

  useEffect(() => {
    if (portfolioData && !chartInitialized && typeof window.initializeWalletCharts === 'function') {
      window.initializeWalletCharts(portfolioData);
      setChartInitialized(true);
    }
  }, [portfolioData, chartInitialized]);

  if (loadingPortfolio) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  if (!portfolioData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Portfolio Summary</h2>
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">Connect your wallet to view your portfolio summary</p>
          <Link to="/wallet" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
            Analyze Wallet
          </Link>
        </div>
      </div>
    );
  }

  // Format large numbers with commas
  const formatValue = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Portfolio Summary</h2>
        <Link 
          to="/wallet" 
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          <span>Detailed Analysis</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Total Value</h3>
          <p className="text-2xl font-bold">{formatValue(portfolioData.totalValueUSD || 0)}</p>
          {portfolioData.performance?.dailyChange && (
            <p className={`text-sm ${parseFloat(portfolioData.performance.dailyChange) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {parseFloat(portfolioData.performance.dailyChange) >= 0 ? '+' : ''}{portfolioData.performance.dailyChange}% today
            </p>
          )}
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Native APT</h3>
          <p className="text-2xl font-bold">{portfolioData.apt?.amount || '0.00'} APT</p>
          <p className="text-sm text-gray-400">{formatValue(portfolioData.apt?.valueUSD || 0)}</p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Staked Assets</h3>
          <p className="text-2xl font-bold">
            {(
              parseFloat(portfolioData.stAPT?.amount || 0) + 
              parseFloat(portfolioData.sthAPT?.amount || 0) + 
              parseFloat(portfolioData.tAPT?.amount || 0) +
              parseFloat(portfolioData.dAPT?.amount || 0)
            ).toFixed(2)} APT
          </p>
          <p className="text-sm text-gray-400">
            {formatValue(
              (portfolioData.stAPT?.valueUSD || 0) + 
              (portfolioData.sthAPT?.valueUSD || 0) + 
              (portfolioData.tAPT?.valueUSD || 0) +
              (portfolioData.dAPT?.valueUSD || 0)
            )}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Allocation</h3>
          <div id="portfolio-allocation-chart" className="h-64 w-full">
            {/* Chart will be rendered here by the initializeWalletCharts function */}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Performance</h3>
          <div id="portfolio-performance-chart" className="h-64 w-full">
            {/* Chart will be rendered here by the initializeWalletCharts function */}
          </div>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">Active Positions</h3>
        <div className="bg-gray-700 rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-600">
            <thead className="bg-gray-600">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Asset</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Protocol</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Value</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">APR</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {portfolioData.stAPT && parseFloat(portfolioData.stAPT.amount) > 0 && (
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">stAPT</td>
                  <td className="px-4 py-2 whitespace-nowrap">Amnis</td>
                  <td className="px-4 py-2 whitespace-nowrap">{portfolioData.stAPT.amount}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatValue(portfolioData.stAPT.valueUSD)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-green-400">{portfolioData.stAPT.apr || '7.5'}%</td>
                </tr>
              )}
              {portfolioData.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0 && (
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">sthAPT</td>
                  <td className="px-4 py-2 whitespace-nowrap">Thala</td>
                  <td className="px-4 py-2 whitespace-nowrap">{portfolioData.sthAPT.amount}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatValue(portfolioData.sthAPT.valueUSD)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-green-400">{portfolioData.sthAPT.apr || '7.3'}%</td>
                </tr>
              )}
              {portfolioData.tAPT && parseFloat(portfolioData.tAPT.amount) > 0 && (
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">tAPT</td>
                  <td className="px-4 py-2 whitespace-nowrap">Tortuga</td>
                  <td className="px-4 py-2 whitespace-nowrap">{portfolioData.tAPT.amount}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatValue(portfolioData.tAPT.valueUSD)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-green-400">{portfolioData.tAPT.apr || '7.2'}%</td>
                </tr>
              )}
              {portfolioData.dAPT && parseFloat(portfolioData.dAPT.amount) > 0 && (
                <tr>
                  <td className="px-4 py-2 whitespace-nowrap">dAPT</td>
                  <td className="px-4 py-2 whitespace-nowrap">Ditto</td>
                  <td className="px-4 py-2 whitespace-nowrap">{portfolioData.dAPT.amount}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatValue(portfolioData.dAPT.valueUSD)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-green-400">{portfolioData.dAPT.apr || '7.1'}%</td>
                </tr>
              )}
              {portfolioData.ammLiquidity?.positions?.map((position, index) => (
                <tr key={index}>
                  <td className="px-4 py-2 whitespace-nowrap">{position.type}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{position.protocol}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{position.valueInApt} APT</td>
                  <td className="px-4 py-2 whitespace-nowrap">{formatValue(position.valueUSD)}</td>
                  <td className="px-4 py-2 whitespace-nowrap text-green-400">~9.5%</td>
                </tr>
              ))}
              {(!portfolioData.stAPT || parseFloat(portfolioData.stAPT.amount) <= 0) &&
               (!portfolioData.sthAPT || parseFloat(portfolioData.sthAPT.amount) <= 0) &&
               (!portfolioData.tAPT || parseFloat(portfolioData.tAPT.amount) <= 0) &&
               (!portfolioData.dAPT || parseFloat(portfolioData.dAPT.amount) <= 0) &&
               (!portfolioData.ammLiquidity?.positions || portfolioData.ammLiquidity.positions.length === 0) && (
                <tr>
                  <td colSpan={5} className="px-4 py-3 text-center text-gray-400">
                    No active positions found. Get started with AI recommendations!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link 
          to="/ai-recommendations" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          Get AI Recommendations
        </Link>
      </div>
    </div>
  );
};

export default PortfolioSummary;