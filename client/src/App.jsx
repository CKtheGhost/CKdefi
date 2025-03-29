// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { WalletProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { RiseWallet } from '@rise-wallet/wallet-adapter';

// Context Providers
import { ThemeProvider } from './context/ThemeContext';
import { NotificationProvider } from './context/NotificationContext';
import { WalletContextProvider } from './context/WalletContext';
import { UserContextProvider } from './context/UserContext';
import { DataProvider } from './context/DataContext';
import { TransactionProvider } from './context/TransactionContext';

// Layouts
import LandingLayout from './components/layout/LandingLayout';
import DashboardLayout from './components/layout/DashboardLayout';
import OnboardingLayout from './components/layout/OnboardingLayout';

// Pages
import Landing from './pages/Landing';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import WalletAnalysis from './pages/WalletAnalysis';
import AIRecommendations from './pages/AIRecommendations';
import ProtocolComparison from './pages/ProtocolComparison';
import AutoOptimizer from './pages/AutoOptimizer';
import Settings from './pages/Settings';
import SocialConnections from './pages/SocialConnections';

// Common Components
import LoadingScreen from './components/common/LoadingScreen';
import Notifications from './components/common/Notifications';

// Initialize wallet adapters
const wallets = [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet(),
  new RiseWallet()
];

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('authToken');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <NotificationProvider>
          <WalletProvider 
            wallets={wallets}
            autoConnect={true}
            network="mainnet"
          >
            <WalletContextProvider>
              <UserContextProvider>
                <DataProvider>
                  <TransactionProvider>
                    <Notifications />
                    <Routes>
                      {/* Public routes */}
                      <Route path="/" element={<LandingLayout><Landing /></LandingLayout>} />
                      
                      {/* Onboarding routes */}
                      <Route path="/onboarding" element={
                        <ProtectedRoute>
                          <OnboardingLayout><Onboarding /></OnboardingLayout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Dashboard routes */}
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <DashboardLayout><Dashboard /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/wallet" element={
                        <ProtectedRoute>
                          <DashboardLayout><WalletAnalysis /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/recommendations" element={
                        <ProtectedRoute>
                          <DashboardLayout><AIRecommendations /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/protocols" element={
                        <ProtectedRoute>
                          <DashboardLayout><ProtocolComparison /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/optimizer" element={
                        <ProtectedRoute>
                          <DashboardLayout><AutoOptimizer /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/social" element={
                        <ProtectedRoute>
                          <DashboardLayout><SocialConnections /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <DashboardLayout><Settings /></DashboardLayout>
                        </ProtectedRoute>
                      } />
                      
                      {/* Fallback route */}
                      <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                  </TransactionProvider>
                </DataProvider>
              </UserContextProvider>
            </WalletContextProvider>
          </WalletProvider>
        </NotificationProvider>
      </ThemeProvider>
    </Router>
  );
};

export default App;