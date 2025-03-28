// src/pages/AIRecommendations.jsx - fix syntax
import React, { useState, useEffect } from 'react';
import { useWalletContext } from '../context/WalletContext';
import DashboardLayout from '../components/layout/DashboardLayout';
import RecommendationForm from '../components/recommendations/RecommendationForm';
import RecommendationResult from '../components/recommendations/RecommendationResult';
import RecommendationHistory from '../components/recommendations/RecommendationHistory';
import ExecutionFlow from '../components/recommendations/ExecutionFlow';
import useRecommendations from '../hooks/useRecommendations';

const AIRecommendations = () => {
  const { isConnected } = useWalletContext();
  const [displayMode, setDisplayMode] = useState('form'); // form, result, execution
  const recommendations = useRecommendations();
  
  // Handle form submission
  const handleSubmit = async (formData) => {
    // Implementation
  };
  
  // Handle strategy execution
  const handleExecute = () => {
    // Implementation
  };
  
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">AI Investment Recommendations</h1>
          <p className="text-gray-400 mt-1">
            Get personalized investment strategies based on your preferences and market conditions.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {displayMode === 'form' && (
              <RecommendationForm 
                formData={recommendations}
                onChange={() => {}}
                onSubmit={handleSubmit}
                loading={recommendations.generatingRecommendation}
                error={recommendations.error}
                isConnected={isConnected}
              />
            )}
            
            {displayMode === 'result' && recommendations.recommendation && (
              <RecommendationResult 
                recommendation={recommendations.recommendation}
                onExecute={handleExecute}
                onBack={() => setDisplayMode('form')}
                isConnected={isConnected}
              />
            )}
            
            {displayMode === 'execution' && (
              <ExecutionFlow 
                recommendation={recommendations.recommendation}
                onComplete={() => setDisplayMode('result')}
                onCancel={() => setDisplayMode('result')}
              />
            )}
          </div>
          
          <div>
            <RecommendationHistory 
              recommendations={recommendations.recommendationHistory}
              onSelect={(recommendation) => {
                // Handle selected recommendation
              }}
            />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AIRecommendations;