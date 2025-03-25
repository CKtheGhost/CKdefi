import React, { useEffect, useState } from 'react';
import { useData } from '../../context/DataContext';
import { Link } from 'react-router-dom';

const MarketOverview = () => {
  const { marketData, loadingMarketData, fetchMarketData, stakingData } = useData();
  const [topCoins, setTopCoins] = useState([]);
  const [aptPrice, setAptPrice] = useState(0);
  const [priceChange, setPriceChange] = useState(0);
  const [topProtocols, setTopProtocols] = useState([]);
  const [chartInitialized, setChartInitialized] = useState(false);

  useEffect(() => {
    if (!marketData) {
      fetchMarketData();
    }
  }, [marketData, fetchMarketData]);

  useEffect(() => {
    // Set top coins when market data is available
    if (marketData && marketData.coins) {
      const sorted = [...marketData.coins].sort((a, b) => b.marketCap - a.marketCap).slice(0, 5);
      setTopCoins(sorted);
      
      // Find APT price and change
      const apt = marketData.coins.find(coin => coin.symbol === 'APT');
      if (apt) {
        setAptPrice(apt.price);
        setPriceChange(apt.change24h);
      }
    }
  }, [marketData]);

  useEffect(() => {
    // Get top protocols by APR when staking data is available
    if (stakingData && stakingData.protocols) {
      const protocols = Object.entries(stakingData.protocols)
        .map(([name, data]) => ({
          name,
          apr: data.blendedStrategy?.apr || (data.staking?.apr || 0),
          product: data.staking?.product || `${name} Staking`
        }))
        .sort((a, b) => parseFloat(b.apr) - parseFloat(a.apr))
        .slice(0, 5);
      
      setTopProtocols(protocols);
    }
  }, [stakingData]);

  useEffect(() => {
    // Initialize chart when data is available and chart hasn't been initialized
    if (marketData && !chartInitialized && typeof window.initializeMarketCharts === 'function') {
      window.initializeMarketCharts(marketData, stakingData);
      setChartInitialized(true);
    }
  }, [marketData, stakingData, chartInitialized]);

  if (loadingMarketData) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Market Overview</h2>
        <div className="flex justify-center items-center h-40">
          <div className="loader"></div>
        </div>
      </div>
    );
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Market Overview</h2>
        <div className="text-sm text-gray-400">
          Last updated: {new Date(marketData?.lastUpdated || Date.now()).toLocaleTimeString()}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">APT Price</h3>
          <p className="text-2xl font-bold">{formatPrice(aptPrice)}</p>
          <p className={`text-sm ${priceChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {priceChange >= 0 ? '+' : ''}{priceChange?.toFixed(2)}% (24h)
          </p>
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Top APR Protocol</h3>
          {topProtocols.length > 0 ? (
            <>
              <p className="text-xl font-bold">{topProtocols[0].name}</p>
              <p className="text-sm text-green-400">{topProtocols[0].apr}% APR</p>
              <p className="text-xs text-gray-400">{topProtocols[0].product}</p>
            </>
          ) : (
            <p className="text-lg">Loading protocols...</p>
          )}
        </div>

        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Average Staking APR</h3>
          <p className="text-2xl font-bold">
            {topProtocols.length > 0 
              ? (topProtocols.reduce((sum, p) => sum + parseFloat(p.apr), 0) / topProtocols.length).toFixed(2)
              : '0.00'}%
          </p>
          <p className="text-sm text-gray-400">Across top protocols</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">APT Price Chart (7d)</h3>
          <div id="apt-price-chart" className="h-64 w-full bg-gray-700 rounded-lg">
            {/* Chart will be rendered here by the initializeMarketCharts function */}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Protocol APR Comparison</h3>
          <div id="protocol-apr-chart" className="h-64 w-full bg-gray-700 rounded-lg">
            {/* Chart will be rendered here by the initializeMarketCharts function */}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Top Coins by Market Cap</h3>
            <Link to="/protocols" className="text-blue-400 hover:text-blue-300 text-sm">View all</Link>
          </div>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Coin</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">Price</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">24h Change</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {topCoins.map((coin, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex items-center">
                        {coin.icon ? (
                          <img src={coin.icon} alt={coin.symbol} className="w-5 h-5 mr-2" />
                        ) : (
                          <div className="w-5 h-5 mr-2 bg-gray-500 rounded-full"></div>
                        )}
                        <span>{coin.symbol}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-right">{formatPrice(coin.price)}</td>
                    <td className={`px-4 py-2 whitespace-nowrap text-right ${coin.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {coin.change24h >= 0 ? '+' : ''}{coin.change24h?.toFixed(2)}%
                    </td>
                  </tr>
                ))}
                {topCoins.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                      No market data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-lg font-semibold">Top Protocols by APR</h3>
            <Link to="/protocols" className="text-blue-400 hover:text-blue-300 text-sm">Compare all</Link>
          </div>
          <div className="bg-gray-700 rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-600">
              <thead className="bg-gray-600">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Protocol</th>
                  <th className="px-4 py-2 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Product</th>
                  <th className="px-4 py-2 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">APR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-600">
                {topProtocols.map((protocol, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 whitespace-nowrap capitalize">{protocol.name}</td>
                    <td className="px-4 py-2 whitespace-nowrap">{protocol.product}</td>
                    <td className="px-4 py-2 whitespace-nowrap text-right text-green-400">{protocol.apr}%</td>
                  </tr>
                ))}
                {topProtocols.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-3 text-center text-gray-400">
                      No protocol data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Link 
          to="/protocols" 
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Compare All Protocols
        </Link>
      </div>
    </div>
  );
};

export default MarketOverview;