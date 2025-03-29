// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '../components/layout/DashboardLayout';
import MarketOverview from '../components/dashboard/MarketOverview';
import PortfolioSummary from '../components/dashboard/PortfolioSummary';
import RecommendedStrategies from '../components/dashboard/RecommendedStrategies';
import LatestNews from '../components/dashboard/LatestNews';
import ActionItems from '../components/dashboard/ActionItems';
import LoadingScreen from '../components/common/LoadingScreen';
import { useWalletContext } from '../context/WalletContext';
import { useUserContext } from '../context/UserContext';
import { useMarketData } from '../hooks/useMarketData';
import { usePortfolio } from '../hooks/usePortfolio';
import { useRecommendations } from '../hooks/useRecommendations';

const Dashboard = () => {
  const navigate = useNavigate();
  const { connected, address } = useWalletContext();
  const { user } = useUserContext();
  const [loading, setLoading] = useState(true);
  
  // Fetch market data
  const { 
    marketData, 
    tokenData, 
    newsData, 
    loading: marketLoading 
  } = useMarketData();
  
  // Fetch portfolio data
  const { 
    portfolio, 
    fetchPortfolio, 
    loading: portfolioLoading 
  } = usePortfolio();
  
  // Fetch recommendations
  const { 
    recommendations,
    fetchRecommendations,
    loading: recommendationsLoading
  } = useRecommendations();

  // If wallet not connected, redirect to landing
  useEffect(() => {
    if (!connected) {
      navigate('/');
    }
  }, [connected, navigate]);

  // Load all data when component mounts
  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        if (connected && address) {
          await fetchPortfolio(address);
          await fetchRecommendations(address);
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, [connected, address, fetchPortfolio, fetchRecommendations]);

  // Show loading screen while data is being fetched
  if (loading || marketLoading || portfolioLoading || recommendationsLoading) {
    return <LoadingScreen message="Loading your dashboard..." />;
  }

  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main content area */}
        <div className="lg:col-span-8 space-y-6">
          <MarketOverview marketData={marketData} />
          
          <PortfolioSummary portfolio={portfolio} />
          
          <RecommendedStrategies 
            recommendations={recommendations} 
            portfolio={portfolio}
          />
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <ActionItems 
            portfolio={portfolio}
            recommendations={recommendations}
          />
          
          <LatestNews news={newsData} />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;