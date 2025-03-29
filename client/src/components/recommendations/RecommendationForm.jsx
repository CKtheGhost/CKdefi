import React, { useState, useEffect } from 'react';
import { useWallet } from '../../hooks/useWallet';
import { useNotification } from '../../hooks/useNotification';
import { Card } from '../common/Card';
import { Spinner } from '../common/Spinner';

const RecommendationForm = ({ onSubmit, isLoading }) => {
  const { wallet, isConnected } = useWallet();
  const { showNotification } = useNotification();
  
  const [amount, setAmount] = useState('100');
  const [riskProfile, setRiskProfile] = useState('balanced');
  const [formValid, setFormValid] = useState(false);
  
  useEffect(() => {
    validateForm();
  }, [amount, riskProfile]);
  
  const validateForm = () => {
    const isAmountValid = !isNaN(parseFloat(amount)) && parseFloat(amount) > 0;
    setFormValid(isAmountValid);
  };
  
  const handleAmountChange = (e) => {
    setAmount(e.target.value);
  };
  
  const handleRiskProfileChange = (e) => {
    setRiskProfile(e.target.value);
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formValid) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }
    
    onSubmit({
      amount: parseFloat(amount),
      riskProfile,
      walletAddress: isConnected ? wallet.address : null
    });
  };
  
  return (
    <Card className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-2xl font-bold mb-4">Get AI-Powered Investment Recommendations</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6">
        Our AI will analyze current market conditions and provide personalized DeFi strategies optimized for your risk profile.
      </p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Investment Amount (APT)
          </label>
          <input
            type="number"
            value={amount}
            onChange={handleAmountChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
            placeholder="Enter amount in APT"
            min="0.01"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Risk Profile
          </label>
          <select
            value={riskProfile}
            onChange={handleRiskProfileChange}
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700"
          >
            <option value="conservative">Conservative</option>
            <option value="balanced">Balanced</option>
            <option value="aggressive">Aggressive</option>
          </select>
        </div>
        
        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading || !formValid}
            className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              isLoading || !formValid ? 'opacity-60 cursor-not-allowed' : ''
            }`}
          >
            {isLoading ? (
              <>
                <Spinner className="w-4 h-4 mr-2" /> 
                Generating Recommendation...
              </>
            ) : (
              'Generate Recommendation'
            )}
          </button>
        </div>
        
        {!isConnected && (
          <div className="mt-4 text-sm text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30 p-3 rounded-md">
            <span className="font-medium">Note:</span> Connect your wallet to receive personalized recommendations based on your portfolio.
          </div>
        )}
      </form>
    </Card>
  );
};

export default RecommendationForm;