// src/hooks/usePortfolio.js
import { useState, useEffect, useCallback } from 'react';
import api from '../services/api';

const usePortfolio = (initialAddress) => {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stakingRecommendations, setStakingRecommendations] = useState(null);

  // Function to fetch portfolio data
  const fetchPortfolioData = useCallback(async (address) => {
    if (!address) return;
    
    setLoading(true);
    setError(null);
    
    try {
      // Get portfolio data from API
      const response = await api.get(`/wallet/${address}/portfolio`);
      
      setPortfolio(response.data);
      
      // Also fetch staking recommendations
      try {
        const recommendationsResponse = await api.get(`/wallet/${address}/recommendations`);
        setStakingRecommendations(recommendationsResponse.data);
      } catch (recError) {
        console.error('Error fetching recommendations:', recError);
        // Don't set main error state for this, as portfolio data was loaded successfully
      }
      
      return response.data;
    } catch (err) {
      console.error('Error fetching portfolio data:', err);
      setError(err.message || 'Failed to load portfolio data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Load portfolio data on initial render if address is provided
  useEffect(() => {
    if (initialAddress) {
      fetchPortfolioData(initialAddress);
    }
  }, [initialAddress, fetchPortfolioData]);

  return {
    portfolio,
    stakingRecommendations,
    loading,
    error,
    fetchPortfolioData
  };
};

// Remove this problematic line:
// import usePortfolio from './usePortfolio';

export default usePortfolio;