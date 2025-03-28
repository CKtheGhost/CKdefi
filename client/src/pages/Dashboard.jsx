import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import MarketOverview from '../components/dashboard/MarketOverview';
import ActionItems from '../components/dashboard/ActionItems';
import RecommendedStrategies from '../components/dashboard/RecommendedStrategies';
import LatestNews from '../components/dashboard/LatestNews';
import TokenTable from '../components/dashboard/TokenTable';
import { useWalletContext } from '../context/WalletContext';
import { useData } from '../context/DataContext';
import Card from '../components/common/Card';

const Dashboard = () => {
  const { isConnected, portfolioData, portfolioLoading, refreshPortfolio, error } = useWalletContext();
  const { stakingData, marketData, fetchStakingData, newsData } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch staking data if not available
    if (!stakingData) {
      fetchStakingData();
    }
    
    // Refresh portfolio data if wallet is connected
    if (isConnected) {
      refreshPortfolio();
    }

    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      if (isConnected) {
        refreshPortfolio();
      }
    }, 5 * 60 * 1000); // Refresh every 5 minutes

    return () => clearInterval(refreshInterval);
  }, [isConnected, fetchStakingData, refreshPortfolio, stakingData]);

  // Calculate total yield and portfolio metrics
  const portfolioMetrics = React.useMemo(() => {
    if (!portfolioData) return { totalValue: 0, totalYield: 0, yieldPercentage: 0 };
    
    const totalValue = portfolioData.totalValueUSD || 0;
    let totalYield = 0;
    let totalStaked = 0;
    
    // Calculate total yield from staked assets
    if (portfolioData.stAPT && parseFloat(portfolioData.stAPT.amount) > 0) {
      const apr = portfolioData.stAPT.apr || 7.2;
      totalYield += (parseFloat(portfolioData.stAPT.valueUSD) * apr / 100);
      totalStaked += parseFloat(portfolioData.stAPT.valueUSD);
    }
    
    if (portfolioData.sthAPT && parseFloat(portfolioData.sthAPT.amount) > 0) {
      const apr = portfolioData.sthAPT.apr || 7.5;
      totalYield += (parseFloat(portfolioData.sthAPT.valueUSD) * apr / 100);
      totalStaked += parseFloat(portfolioData.sthAPT.valueUSD);
    }
    
    if (portfolioData.tAPT && parseFloat(portfolioData.tAPT.amount) > 0) {
      const apr = portfolioData.tAPT.apr || 7.0;
      totalYield += (parseFloat(portfolioData.tAPT.valueUSD) * apr / 100);
      totalStaked += parseFloat(portfolioData.tAPT.valueUSD);
    }
    
    if (portfolioData.dAPT && parseFloat(portfolioData.dAPT.amount) > 0) {
      const apr = portfolioData.dAPT.apr || 7.8;
      totalYield += (parseFloat(portfolioData.dAPT.valueUSD) * apr / 100);
      totalStaked += parseFloat(portfolioData.dAPT.valueUSD);
    }
    
    // Calculate yield from liquidity positions
    if (portfolioData.ammLiquidity && portfolioData.ammLiquidity.hasLiquidity) {
      if (portfolioData.ammLiquidity.positions) {
        portfolioData.ammLiquidity.positions.forEach(position => {
          const apr = position.apr || 8.0;
          totalYield += (parseFloat(position.valueUSD) * apr / 100);
          totalStaked += parseFloat(position.valueUSD);
        });
      } else if (portfolioData.ammLiquidity.estimatedValueUSD) {
        const apr = 8.0; // Default APR estimation
        totalYield += (parseFloat(portfolioData.ammLiquidity.estimatedValueUSD) * apr / 100);
        totalStaked += parseFloat(portfolioData.ammLiquidity.estimatedValueUSD);
      }
    }
    
    // Calculate overall yield percentage
    const yieldPercentage = totalValue > 0 ? (totalYield / totalValue) * 100 : 0;
    
    return { totalValue, totalYield, yieldPercentage, totalStaked };
  }, [portfolioData]);

  const renderWelcomeCard = () => {
    if (isConnected) return null;
    
    return (
      <Card className="mb-6 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-2">Welcome to CompounDefi</h2>
            <p className="mb-4">Connect your wallet to access AI-powered yield optimization and portfolio management.</p>
            <button 
              onClick={() => navigate('/wallet')}
              className="px-4 py-2 bg-white text-blue-700 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Connect Wallet
            </button>
          </div>
          <div className="p-6 hidden md:block">
            <div className="flex items-center justify-center rounded-full bg-blue-500/30 p-4 w-24 h-24">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
          </div>
        </div>
      </Card>
    );
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 md:mb-0">Dashboard</h1>
          
          {isConnected && (
            <div className="flex space-x-4">
              <button
                onClick={() => refreshPortfolio()}
                className="flex items-center px-3 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh Data
              </button>
              
              <button
                onClick={() => navigate('/ai-recommendations')}
                className="flex items-center px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Get AI Recommendation
              </button>
            </div>
          )}
        </div>
        
        {renderWelcomeCard()}
        
        {isConnected && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card className="bg-blue-500 text-white">
              <div className="p-4">
                <h3 className="text-sm font-medium text-blue-100 mb-1">Portfolio Value</h3>
                <p className="text-2xl font-bold">${portfolioMetrics.totalValue.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                <div className="mt-2 text-sm">
                  <span className="inline-block bg-blue-600 rounded-full px-2 py-0.5">
                    {portfolioData?.performance?.dailyChange || '+0.00'}% today
                  </span>
                </div>
              </div>
            </Card>
            
            <Card className="bg-green-500 text-white">
              <div className="p-4">
                <h3 className="text-sm font-medium text-green-100 mb-1">Annual Yield</h3>
                <p className="text-2xl font-bold">${portfolioMetrics.totalYield.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                <div className="mt-2 text-sm">
                  <span className="inline-block bg-green-600 rounded-full px-2 py-0.5">
                    {portfolioMetrics.yieldPercentage.toFixed(2)}% APR
                  </span>
                </div>
              </div>
            </Card>
            
            <Card className="bg-purple-500 text-white">
              <div className="p-4">
                <h3 className="text-sm font-medium text-purple-100 mb-1">Staked Assets</h3>
                <p className="text-2xl font-bold">${portfolioMetrics.totalStaked.toLocaleString(undefined, {maximumFractionDigits: 2})}</p>
                <div className="mt-2 text-sm">
                  <span className="inline-block bg-purple-600 rounded-full px-2 py-0.5">
                    {portfolioMetrics.totalStaked > 0 ? ((portfolioMetrics.totalStaked / portfolioMetrics.totalValue) * 100).toFixed(2) : '0.00'}% of portfolio
                  </span>
                </div>
              </div>
            </Card>
            
            <Card className="bg-amber-500 text-white">
              <div className="p-4">
                <h3 className="text-sm font-medium text-amber-100 mb-1">APT Price</h3>
                <p className="text-2xl font-bold">${(portfolioData?.apt?.price || 0).toFixed(2)}</p>
                <div className="mt-2 text-sm">
                  <span className="inline-block bg-amber-600 rounded-full px-2 py-0.5">
                    {marketData?.coins?.find(c => c.symbol === 'APT')?.change24h?.toFixed(2) || '+0.00'}% (24h)
                  </span>
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {/* Navigation tabs */}
        <div className="mb-6 border-b border-gray-200 dark:border-gray-700">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('portfolio')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'portfolio'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Portfolio
            </button>
            <button
              onClick={() => setActiveTab('market')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'market'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              Market
            </button>
            <button
              onClick={() => setActiveTab('news')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'news'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              News
            </button>
          </nav>
        </div>
        
        {/* Active tab content */}
        {activeTab === 'overview' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <PortfolioSummary 
                  portfolioData={portfolioData} 
                  loading={portfolioLoading} 
                  error={error}
                />
              </div>
              <div>
                <ActionItems walletConnected={isConnected} />
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <MarketOverview />
              <RecommendedStrategies stakingData={stakingData} />
            </div>
          </>
        )}
        
        {activeTab === 'portfolio' && (
          <div className="grid grid-cols-1 gap-6">
            <PortfolioSummary 
              portfolioData={portfolioData} 
              loading={portfolioLoading} 
              error={error}
              detailed={true}
            />
            
            {isConnected ? (
              <Card>
                <div className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Yield Opportunities</h2>
                  <p className="mb-4">Based on your current portfolio allocation, here are some yield optimization strategies:</p>
                  
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                    <div className="flex items-start">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 mt-0.5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <div>
                        <h3 className="font-medium text-blue-700 dark:text-blue-300">Auto-Optimizer Available</h3>
                        <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                          Enable the Auto-Optimizer to automatically maintain optimal yield across market conditions.
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <button 
                      onClick={() => navigate('/optimizer')}
                      className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                        </svg>
                        <span>Enable Auto-Optimizer</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => navigate('/ai-recommendations')}
                      className="flex items-center justify-between px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        <span>Get AI Recommendations</span>
                      </div>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="text-center mt-6">
                    <button 
                      onClick={() => navigate('/protocols')}
                      className="text-blue-500 hover:text-blue-700 dark:hover:text-blue-300 text-sm"
                    >
                      View all protocol options →
                    </button>
                  </div>
                </div>
              </Card>
            ) : (
              <Card>
                <div className="p-6 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <h3 className="text-lg font-medium mb-2">Connect Your Wallet</h3>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">Connect your wallet to view your portfolio and AI-powered optimization options.</p>
                  <button
                    onClick={() => navigate('/wallet')}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Connect Wallet
                  </button>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {activeTab === 'market' && (
          <div className="grid grid-cols-1 gap-6">
            <MarketOverview />
            <TokenTable tokens={marketData?.coins || []} />
          </div>
        )}
        
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 gap-6">
            <LatestNews />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;