import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

// Import pages
import Dashboard from './pages/Dashboard';
import AIRecommendations from './pages/AIRecommendations';
import AutoOptimizer from './pages/AutoOptimizer';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import ProtocolComparison from './pages/ProtocolComparison';
import Settings from './pages/Settings';
import WalletAnalysis from './pages/WalletAnalysis';

// Import context providers
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { ThemeProvider } from './context/ThemeContext';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';
import { WalletProvider } from './context/WalletContext';

const App = () => {
  return (
    <AptosWalletAdapterProvider plugins={[]} autoConnect={false}>
      <ThemeProvider>
        <NotificationProvider>
          <UserProvider>
            <WalletProvider>
              <TransactionProvider>
                <DataProvider>
                  <Router>
                    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                      <main className="min-h-screen">
                        <Routes>
                          {/* Public routes */}
                          <Route path="/" element={<Landing />} />
                          <Route path="/onboarding" element={<Onboarding />} />
                          
                          {/* App routes */}
                          <Route path="/dashboard" element={<Dashboard />} />
                          <Route path="/recommendations" element={<AIRecommendations />} />
                          <Route path="/optimizer" element={<AutoOptimizer />} />
                          <Route path="/protocols" element={<ProtocolComparison />} />
                          <Route path="/settings" element={<Settings />} />
                          <Route path="/wallet" element={<WalletAnalysis />} />
                          <Route path="/wallet/:walletAddress" element={<WalletAnalysis />} />
                          
                          {/* Fallback route */}
                          <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                      </main>
                    </div>
                  </Router>
                </DataProvider>
              </TransactionProvider>
            </WalletProvider>
          </UserProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AptosWalletAdapterProvider>
  );
};

export default App;