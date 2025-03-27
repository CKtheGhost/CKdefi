import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Dashboard = () => {
  const { isLoading, stakingData, marketData, newsData, lastUpdated } = useData();

  // UI components for dashboard sections
  const MarketSection = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Market Overview</h2>
      {marketData ? (
        <div className="space-y-4">
          {marketData.tokens.map((token, idx) => (
            <div key={idx} className="flex justify-between items-center border-b border-gray-700 pb-3">
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                  <span className="font-bold text-white">{token.symbol.charAt(0)}</span>
                </div>
                <div>
                  <div className="font-medium text-white">{token.symbol}</div>
                  <div className="text-sm text-gray-400">Aptos</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-medium text-white">${token.price.toFixed(2)}</div>
                <div className={`text-sm ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change24h >= 0 ? '↑' : '↓'} {Math.abs(token.change24h).toFixed(2)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400">Loading market data...</div>
        </div>
      )}
    </div>
  );

  const StakingSection = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Staking Opportunities</h2>
      {stakingData ? (
        <div className="space-y-4">
          {Object.entries(stakingData.protocols).map(([name, data], idx) => (
            <div key={idx} className="p-4 bg-gray-700 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <div className="font-medium text-white capitalize">{name}</div>
                <div className="text-blue-400 font-bold">{data.staking?.apr || '0'}% APR</div>
              </div>
              <div className="text-sm text-gray-400">
                Product: {data.staking?.product || 'Unknown'}
              </div>
              {data.blendedStrategy && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-400">Blended strategy:</span>
                  <span className="text-green-400 ml-2">{data.blendedStrategy.apr}% APR</span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400">Loading staking data...</div>
        </div>
      )}
    </div>
  );

  const NewsSection = () => (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Latest News</h2>
      {newsData.length > 0 ? (
        <div className="space-y-4">
          {newsData.map((item, idx) => (
            <div key={idx} className="p-4 bg-gray-700 rounded-lg">
              <div className="font-medium text-white mb-1">{item.title}</div>
              <div className="text-sm text-gray-400">{new Date(item.date).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <div className="text-gray-400">No news available</div>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">CompounDefi Dashboard</h1>
        <Link 
          to="/recommendations" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow"
        >
          AI Recommendations
        </Link>
      </div>

      {isLoading ? (
        <div className="text-center py-20">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-gray-700">Loading dashboard data...</div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MarketSection />
          <StakingSection />
          <NewsSection />
        </div>
      )}

      <div className="mt-6 text-right text-sm text-gray-500">
        Last updated: {lastUpdated.toLocaleString()}
      </div>
    </div>
  );
};

export default Dashboard;