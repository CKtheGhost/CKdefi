// src/hooks/useMarketData.js
import { useState, useCallback, useEffect } from 'react';
import api from '../services/api';

const useMarketData = () => {
  const [stakingData, setStakingData] = useState(null);
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch market data including protocols, staking rates, etc.
  const fetchMarketData = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch staking data
      const stakingResponse = await api.get('/market/staking');
      setStakingData(stakingResponse.data);
      
      // Fetch token market data
      const marketResponse = await api.get('/market/tokens');
      setMarketData(marketResponse.data);
      
      return {
        stakingData: stakingResponse.data,
        marketData: marketResponse.data
      };
    } catch (err) {
      console.error('Error fetching market data:', err);
      setError(err.message || 'Failed to fetch market data');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchMarketData();
  }, [fetchMarketData]);

  return {
    stakingData,
    marketData,
    loading,
    error,
    fetchMarketData
  };
};

export default useMarketData;
export { useMarketData };