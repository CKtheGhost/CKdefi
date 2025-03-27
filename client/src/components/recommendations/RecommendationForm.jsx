// src/components/recommendations/RecommendationForm.jsx

import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../../context/WalletContext';
import { useNotification } from '../../hooks/useNotification';

const RecommendationForm = ({ onSubmit, isLoading }) => {
  const { wallet, isConnected } = useWalletContext();
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
        {/* Form content here */}
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md flex items-center"
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate AI Recommendation"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RecommendationForm;