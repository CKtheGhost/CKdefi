// src/components/recommendations/RecommendationForm.jsx

import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useNotification } from '../../hooks/useNotification';

const RecommendationForm = ({ onSubmit, isLoading }) => {
  const { wallet, isConnected } = useWallet();
  const { showNotification } = useNotification();
  
  const [formData, setFormData] = useState({
    amount: '100',
    riskProfile: 'balanced',
    walletAddress: '',
    preserveStakedPositions: true,
    includeMemeTokens: false
  });
  
  const [showAdvanced, setShowAdvanced] = useState(false);
  
  // Update wallet address when wallet connection changes
  useEffect(() => {
    if (isConnected && wallet.address) {
      setFormData(prev => ({
        ...prev,
        walletAddress: wallet.address
      }));
    }
  }, [isConnected, wallet]);
  
  // Load saved preferences from localStorage
  useEffect(() => {
    const savedAmount = localStorage.getItem('lastInvestmentAmount');
    const savedRiskProfile = localStorage.getItem('defaultRiskProfile');
    const savedPreserveStaked = localStorage.getItem('preserveStakedPositions') === 'true';
    
    if (savedAmount) setFormData(prev => ({ ...prev, amount: savedAmount }));
    if (savedRiskProfile) setFormData(prev => ({ ...prev, riskProfile: savedRiskProfile }));
    if (savedPreserveStaked !== null) setFormData(prev => ({ ...prev, preserveStakedPositions: savedPreserveStaked }));
  }, []);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validate input
    if (!formData.amount || isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      showNotification('Please enter a valid investment amount', 'error');
      return;
    }
    
    // Save preferences
    localStorage.setItem('lastInvestmentAmount', formData.amount);
    localStorage.setItem('defaultRiskProfile', formData.riskProfile);
    localStorage.setItem('preserveStakedPositions', formData.preserveStakedPositions);
    
    // Submit form data
    onSubmit(formData);
  };
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
      <h2 className="text-xl font-bold mb-4 text-white">AI Investment Recommendation</h2>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
              Investment Amount (APT)
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <input
                type="number"
                name="amount"
                id="amount"
                className="bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-md"
                placeholder="100"
                value={formData.amount}
                onChange={handleChange}
                min="0.1"
                step="0.1"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-300 mb-1">
              Risk Profile
            </label>
            <select
              id="riskProfile"
              name="riskProfile"
              className="bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-md"
              value={formData.riskProfile}
              onChange={handleChange}
            >
              <option value="conservative">Conservative</option>
              <option value="balanced">Balanced</option>
              <option value="aggressive">Aggressive</option>
              <option value="yield_optimizer">Yield Optimizer</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label htmlFor="walletAddress" className="block text-sm font-medium text-gray-300 mb-1">
              Wallet Address
            </label>
            <input
              type="text"
              name="walletAddress"
              id="walletAddress"
              className="bg-gray-700 text-white focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 rounded-md"
              placeholder="0x..."
              value={formData.walletAddress}
              onChange={handleChange}
              readOnly={isConnected}
            />
            {!isConnected && (
              <p className="mt-1 text-sm text-yellow-500">
                Connect your wallet for personalized recommendations
              </p>
            )}
          </div>
          
          <div className="md:col-span-2">
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center"
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 mr-1 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              Advanced Options
            </button>
            
            {showAdvanced && (
              <div className="mt-4 p-4 bg-gray-700 rounded-md">
                <div className="flex items-center mb-3">
                  <input
                    id="preserveStakedPositions"
                    name="preserveStakedPositions"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    checked={formData.preserveStakedPositions}
                    onChange={handleChange}
                  />
                  <label htmlFor="preserveStakedPositions" className="ml-2 block text-sm text-gray-300">
                    Preserve existing staked positions
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    id="includeMemeTokens"
                    name="includeMemeTokens"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                    checked={formData.includeMemeTokens}
                    onChange={handleChange}
                  />
                  <label htmlFor="includeMemeTokens" className="ml-2 block text-sm text-gray-300">
                    Include meme tokens in recommendations (higher risk)
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-2 gap-4" id="strategy-presets">
          <button
            type="button"
            className="preset-button flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            onClick={() => setFormData(prev => ({ ...prev, riskProfile: 'conservative' }))}
          >
            <div className="rounded-full bg-blue-100 p-2 mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Conservative</div>
              <div className="text-xs text-gray-400">Low-risk strategy focused on stable returns</div>
            </div>
          </button>
          
          <button
            type="button"
            className="preset-button flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            onClick={() => setFormData(prev => ({ ...prev, riskProfile: 'balanced' }))}
          >
            <div className="rounded-full bg-blue-100 p-2 mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Balanced</div>
              <div className="text-xs text-gray-400">Balanced risk-reward approach</div>
            </div>
          </button>
          
          <button
            type="button"
            className="preset-button flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            onClick={() => setFormData(prev => ({ ...prev, riskProfile: 'aggressive' }))}
          >
            <div className="rounded-full bg-blue-100 p-2 mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Aggressive</div>
              <div className="text-xs text-gray-400">High-risk, high-reward strategy</div>
            </div>
          </button>
          
          <button
            type="button"
            className="preset-button flex items-center p-3 bg-gray-700 rounded-lg hover:bg-gray-600 transition-all"
            onClick={() => setFormData(prev => ({ ...prev, riskProfile: 'yield_optimizer' }))}
          >
            <div className="rounded-full bg-blue-100 p-2 mr-3 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="text-left">
              <div className="font-medium text-white">Yield Optimizer</div>
              <div className="text-xs text-gray-400">Focus on highest possible returns</div>
            </div>
          </button>
        </div>
        
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md flex items-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                Generate AI Recommendation
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;