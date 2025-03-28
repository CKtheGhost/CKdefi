import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import Button from '../common/Button';
import { RISK_PROFILES } from '../../utils/constants';

const RecommendationForm = ({ 
  formData, 
  onChange, 
  onSubmit, 
  loading, 
  error, 
  validationErrors,
  isConnected 
}) => {
  const { address } = useWalletContext();
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Update wallet address when connected
  useEffect(() => {
    if (isConnected && address) {
      onChange('walletAddress', address);
    }
  }, [isConnected, address, onChange]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit();
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    onChange(name, type === 'checkbox' ? checked : value);
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-900/20 border border-blue-800/30 rounded-lg p-4 mb-6">
        <h3 className="text-lg font-medium text-blue-300 mb-2">AI-Powered Investment Strategy</h3>
        <p className="text-gray-300 text-sm">
          Our advanced AI will analyze current market conditions and generate a personalized investment 
          strategy based on your preferences and risk profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-200 mb-1">
              Investment Amount (APT)
            </label>
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleInputChange}
              placeholder="Enter amount in APT"
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="0.1"
              step="0.1"
            />
            {validationErrors?.amount && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.amount}</p>
            )}
          </div>

          <div>
            <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-200 mb-1">
              Risk Profile
            </label>
            <select
              id="riskProfile"
              name="riskProfile"
              value={formData.riskProfile}
              onChange={handleInputChange}
              className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="yield_optimizer">Yield Optimizer</option>
              <option value="stablecoin_yield">Stablecoin Yield</option>
            </select>
            {validationErrors?.riskProfile && (
              <p className="mt-1 text-sm text-red-500">{validationErrors.riskProfile}</p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="includePortfolio"
              name="includePortfolio"
              checked={formData.includePortfolio}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              disabled={!isConnected}
            />
            <label htmlFor="includePortfolio" className="ml-2 block text-sm text-gray-300">
              Include current portfolio in recommendation
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="preserveStakedPositions"
              name="preserveStakedPositions"
              checked={formData.preserveStakedPositions}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
            />
            <label htmlFor="preserveStakedPositions" className="ml-2 block text-sm text-gray-300">
              Preserve staked positions
            </label>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? 'rotate-90' : ''}`} 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            {showAdvanced ? 'Hide Advanced Options' : 'Show Advanced Options'}
          </button>
        </div>

        {showAdvanced && (
          <div className="p-4 bg-gray-750 rounded-lg border border-gray-600 space-y-4">
            <div>
              <label htmlFor="customWalletAddress" className="block text-sm font-medium text-gray-200 mb-1">
                Custom Wallet Address (Optional)
              </label>
              <input
                type="text"
                id="customWalletAddress"
                name="walletAddress"
                value={formData.walletAddress || ''}
                onChange={handleInputChange}
                placeholder="Enter Aptos wallet address"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-400">
                Leave empty to use your connected wallet or enter a specific wallet address
              </p>
            </div>

            <div>
              <label htmlFor="maxProtocols" className="block text-sm font-medium text-gray-200 mb-1">
                Maximum Protocols
              </label>
              <input
                type="number"
                id="maxProtocols"
                name="maxProtocols"
                value={formData.maxProtocols || 5}
                onChange={handleInputChange}
                min="1"
                max="10"
                className="w-full bg-gray-700 border border-gray-600 rounded-md px-3 py-2 text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="mt-1 text-xs text-gray-400">
                Limit the number of protocols in your recommended strategy
              </p>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeMemeTokens"
                name="includeMemeTokens"
                checked={formData.includeMemeTokens || false}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-600 rounded bg-gray-700"
              />
              <label htmlFor="includeMemeTokens" className="ml-2 block text-sm text-gray-300">
                Include meme tokens in recommendation
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-900/30 border border-red-800 rounded-lg text-red-300 text-sm">
            {error}
          </div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            disabled={loading || (!isConnected && !formData.walletAddress)}
            className="w-full md:w-auto"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </span>
            ) : (
              'Generate AI Recommendation'
            )}
          </Button>
        </div>
      </form>

      {!isConnected && (
        <div className="text-center py-4 px-6 bg-yellow-900/30 border border-yellow-800/50 rounded-lg">
          <p className="text-yellow-300 text-sm">
            Connect your wallet for a personalized recommendation based on your current portfolio.
          </p>
        </div>
      )}
    </div>
  );
};

export default RecommendationForm;