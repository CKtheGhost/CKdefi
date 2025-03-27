import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';

// Import pages
import Dashboard from './pages/Dashboard';
import AIRecommendations from './pages/AIRecommendations';

// Import context providers
import { DataProvider } from './context/DataContext';

const App = () => {
  return (
    <AptosWalletAdapterProvider plugins={[]} autoConnect={false}>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <main className="p-4 sm:p-6 max-w-7xl mx-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/recommendations" element={<AIRecommendations />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </main>
          </div>
        </Router>
      </DataProvider>
    </AptosWalletAdapterProvider>
  );
};

export default App;