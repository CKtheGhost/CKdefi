// src/pages/WalletAnalysis.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWalletContext } from '../context/WalletContext';
import usePortfolio from '../hooks/usePortfolio';
import DashboardLayout from '../components/layout/DashboardLayout';
import WalletHeader from '../components/wallet/WalletHeader';
import AllocationChart from '../components/wallet/AllocationChart';
import PerformanceChart from '../components/wallet/PerformanceChart';
import StakedAssets from '../components/wallet/StakedAssets';
import LiquidityPositions from '../components/wallet/LiquidityPositions';
import TransactionHistory from '../components/wallet/TransactionHistory';
import Button from '../components/common/Button';
import LoadingScreen from '../components/common/LoadingScreen';
import { useNotification } from '../context/NotificationContext';

const WalletAnalysis = () => {
  const { walletAddress } = useParams();
  const navigate = useNavigate();
  const { connected, address, connectWallet } = useWalletContext();
  const { portfolio, stakingRecommendations, loading, error, fetchPortfolioData } = usePortfolio();
  const { showNotification } = useNotification();
  const [activeSection, setActiveSection] = useState('wallet-analysis');

  // Use the connected wallet's address if no address is provided in URL
  const targetAddress = walletAddress || address;

  useEffect(() => {
    if (targetAddress) {
      fetchPortfolioData(targetAddress);
      
      // Set up automatic refresh interval (every 2 minutes)
      const refreshInterval = setInterval(() => {
        fetchPortfolioData(targetAddress);
      }, 2 * 60 * 1000);
      
      return () => clearInterval(refreshInterval);
    } else if (connected) {
      // Redirect to the connected wallet's analysis page
      navigate(`/wallet/${address}`);
    }
  }, [targetAddress, connected, address, fetchPortfolioData, navigate]);

  useEffect(() => {
    // Display error notification if there's a problem with portfolio data
    if (error) {
      showNotification(`Error analyzing wallet: ${error}`, 'error');
    }
  }, [error, showNotification]);

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleConnectWallet = async () => {
    try {
      await connectWallet();
    } catch (error) {
      showNotification(`Failed to connect wallet: ${error.message}`, 'error');
    }
  };

  if (!targetAddress) {
    return (
      <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
        <div className="container mx-auto px-4 py-12 text-center">
          <h2 className="text-2xl font-bold mb-6">Wallet Analysis</h2>
          <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-8 max-w-md mx-auto">
            <p className="text-gray-600 dark:text-gray-300 mb-6">Connect your wallet to view your portfolio analysis</p>
            <Button 
              onClick={handleConnectWallet} 
              variant="primary"
              size="lg"
            >
              Connect Wallet
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (loading && !portfolio) {
    return <LoadingScreen message={`Analyzing wallet ${targetAddress.slice(0, 6)}...${targetAddress.slice(-4)}`} />;
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <section id="wallet-analysis">
        <div className="container mx-auto px-4 py-6">
          <WalletHeader 
            portfolioData={portfolio}
            isLoading={loading}
            onRefresh={() => fetchPortfolioData(targetAddress)}
          />
          
          <div className="lg:col-span-2 space-y-6">
              <AllocationChart portfolioData={portfolio} />
              <PerformanceChart portfolioData={portfolio} />
            </div>
            
            <div className="space-y-6">
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <h3 className="text-lg font-semibold text-white mb-4">Summary</h3>
                <PortfolioSummary portfolio={portfolio} />
              </div>
              
              {connected && (
                <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button 
                      onClick={() => navigate('/ai-recommendations')}
                      className="w-full"
                    >
                      Get AI Recommendations
                    </Button>
                    <Button 
                      onClick={() => navigate('/optimizer')}
                      variant="outline"
                      className="w-full"
                    >
                      Configure Auto-Optimizer
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <StakedAssets portfolioData={portfolio} />
            <LiquidityPositions portfolioData={portfolio} />
          </div>
          <TransactionHistory walletAddress={targetAddress} />
        </div>
      </section>
    </DashboardLayout>
  );
};

function PortfolioSummary({ portfolio }) {
  if (!portfolio) return <p className="text-gray-400">No portfolio data available</p>;
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between">
        <span className="text-gray-400">Total Value:</span>
        <span className="font-semibold text-white">${portfolio.totalValueUSD?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Native APT:</span>
        <span className="font-semibold text-white">{portfolio.apt?.amount || '0'} APT</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Staked APT:</span>
        <span className="font-semibold text-white">
          {(parseFloat(portfolio.stAPT?.amount || 0) + 
           parseFloat(portfolio.sthAPT?.amount || 0) + 
           parseFloat(portfolio.tAPT?.amount || 0) +
           parseFloat(portfolio.dAPT?.amount || 0)).toFixed(2)} APT
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Liquidity Positions:</span>
        <span className="font-semibold text-white">${portfolio.ammLiquidity?.estimatedValueUSD?.toFixed(2) || '0.00'}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-400">Unrealized Gains:</span>
        <span className={`font-semibold ${portfolio.unrealizedGainUSD > 0 ? 'text-green-400' : portfolio.unrealizedGainUSD < 0 ? 'text-red-400' : 'text-white'}`}>
          ${portfolio.unrealizedGainUSD?.toFixed(2) || '0.00'}
        </span>
      </div>
    </div>
  );
}

export default WalletAnalysis;