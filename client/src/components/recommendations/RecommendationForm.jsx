// src/components/recommendations/RecommendationForm.jsx
import React, { useState } from 'react';
import Card from '../common/Card';
import Button from '../common/Button';
import { useWalletContext } from '../../context/WalletContext';

const RecommendationForm = ({ formData, onChange, onSubmit, loading, error, isConnected }) => {
  const { portfolioData } = useWalletContext();
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [riskLevel, setRiskLevel] = useState('balanced');
  const [timeHorizon, setTimeHorizon] = useState('medium');
  const [preferredProtocols, setPreferredProtocols] = useState([]);
  const [excludedProtocols, setExcludedProtocols] = useState([]);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    if (!isConnected) {
      return;
    }

    // Create form data object
    const formData = {
      investmentAmount: investmentAmount || (portfolioData?.apt?.amount || '0'),
      riskLevel,
      timeHorizon,
      preferredProtocols,
      excludedProtocols
    };

    // Call onSubmit callback
    onSubmit(formData);
  };

  // Toggle protocol selection
  const toggleProtocol = (protocol, list, setList) => {
    if (list.includes(protocol)) {
      setList(list.filter(p => p !== protocol));
    } else {
      setList([...list, protocol]);
    }
  };

  if (!isConnected) {
    return (
      <Card className="bg-gray-800 border border-gray-700">
        <div className="p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <h2 className="text-xl font-semibold mb-2">Connect Your Wallet</h2>
          <p className="text-gray-400 mb-6">
            Please connect your wallet to get personalized AI recommendations.
          </p>
          <Button variant="primary">
            Connect Wallet
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800 border border-gray-700">
      <div className="p-6">
        <h2 className="text-xl font-bold mb-4">Get AI Recommendations</h2>
        <p className="text-gray-400 mb-6">
          Customize your preferences to get a personalized investment strategy.
        </p>

        {error && (
          <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 mb-6 text-red-300">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mt-0.5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="space-y-6">
            {/* Investment Amount */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Investment Amount (APT)
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={investmentAmount}
                  onChange={(e) => setInvestmentAmount(e.target.value)}
                  placeholder={portfolioData?.apt?.amount || '0'}
                  className="w-full bg-gray-700 border border-gray-600 rounded-l-md px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="bg-gray-600 px-4 py-2 rounded-r-md flex items-center">
                  <span>APT</span>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-400">
                Available balance: {portfolioData?.apt?.amount || '0'} APT (${portfolioData?.apt?.valueUSD?.toFixed(2) || '0'})
              </p>
            </div>

            {/* Risk Level */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Risk Level
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setRiskLevel('conservative')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    riskLevel === 'conservative' 
                      ? 'bg-green-900/30 border-green-500 text-green-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Conservative
                </button>
                <button
                  type="button"
                  onClick={() => setRiskLevel('balanced')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    riskLevel === 'balanced' 
                      ? 'bg-blue-900/30 border-blue-500 text-blue-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Balanced
                </button>
                <button
                  type="button"
                  onClick={() => setRiskLevel('aggressive')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    riskLevel === 'aggressive' 
                      ? 'bg-red-900/30 border-red-500 text-red-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Aggressive
                </button>
              </div>
            </div>

            {/* Time Horizon */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Time Horizon
              </label>
              <div className="grid grid-cols-3 gap-4">
                <button
                  type="button"
                  onClick={() => setTimeHorizon('short')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    timeHorizon === 'short' 
                      ? 'bg-purple-900/30 border-purple-500 text-purple-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Short Term
                </button>
                <button
                  type="button"
                  onClick={() => setTimeHorizon('medium')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    timeHorizon === 'medium' 
                      ? 'bg-purple-900/30 border-purple-500 text-purple-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Medium Term
                </button>
                <button
                  type="button"
                  onClick={() => setTimeHorizon('long')}
                  className={`px-4 py-3 rounded-lg border text-center ${
                    timeHorizon === 'long' 
                      ? 'bg-purple-900/30 border-purple-500 text-purple-400' 
                      : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                  }`}
                >
                  Long Term
                </button>
              </div>
            </div>

            {/* Protocol Preferences */}
            <div className="border-t border-gray-700 pt-4">
              <label className="block text-sm font-medium mb-2">
                Preferred Protocols (Optional)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Amnis', 'Thala', 'Tortuga', 'Ditto', 'Aries', 'PancakeSwap', 'Cetus'].map(protocol => (
                  <button
                    key={protocol}
                    type="button"
                    onClick={() => toggleProtocol(protocol, preferredProtocols, setPreferredProtocols)}
                    className={`px-3 py-2 rounded-lg border text-center text-sm ${
                      preferredProtocols.includes(protocol) 
                        ? 'bg-blue-900/30 border-blue-500 text-blue-400' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {protocol}
                  </button>
                ))}
              </div>
            </div>

            {/* Protocol Exclusions */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Excluded Protocols (Optional)
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
                {['Amnis', 'Thala', 'Tortuga', 'Ditto', 'Aries', 'PancakeSwap', 'Cetus'].map(protocol => (
                  <button
                    key={protocol}
                    type="button"
                    onClick={() => toggleProtocol(protocol, excludedProtocols, setExcludedProtocols)}
                    className={`px-3 py-2 rounded-lg border text-center text-sm ${
                      excludedProtocols.includes(protocol) 
                        ? 'bg-red-900/30 border-red-500 text-red-400' 
                        : 'bg-gray-700 border-gray-600 text-gray-300 hover:border-gray-500'
                    }`}
                  >
                    {protocol}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              type="submit"
              variant="primary"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating Recommendations...
                </span>
              ) : 'Generate AI Recommendations'}
            </Button>
          </div>
        </form>
      </div>
    </Card>
  );
};

export default RecommendationForm;