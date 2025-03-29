import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { usePortfolio } from '../../hooks/usePortfolio';
import axios from 'axios';

// Helper to format dates for the chart
const formatDate = (dateString) => {
  const date = new Date(dateString);
  return `${date.getMonth() + 1}/${date.getDate()}`;
};

// Tooltip customization
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white dark:bg-gray-800 p-3 rounded shadow-lg border border-gray-200 dark:border-gray-700">
        <p className="font-semibold mb-1">{payload[0].payload.fullDate}</p>
        <p className="text-sm flex items-center">
          <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
          <span>Value: ${parseFloat(payload[0].value).toFixed(2)}</span>
        </p>
        <p className="text-sm flex items-center">
          <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
          <span>APT Price: ${parseFloat(payload[0].payload.aptPrice).toFixed(2)}</span>
        </p>
      </div>
    );
  }
  return null;
};

const PerformanceChart = ({ className = "", period = '30d' }) => {
  const { portfolio, walletAddress } = usePortfolio();
  const [historicalData, setHistoricalData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activePeriod, setActivePeriod] = useState(period);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!walletAddress) {
      setIsLoading(false);
      return;
    }

    const fetchHistoricalData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/api/wallet/${walletAddress}/performance?period=${activePeriod}`);
        
        if (response.data && response.data.historicalData && Array.isArray(response.data.historicalData)) {
          // Transform data for the chart
          const chartData = response.data.historicalData.map(item => ({
            date: formatDate(item.date),
            fullDate: new Date(item.date).toLocaleDateString(),
            value: parseFloat(item.value),
            aptPrice: parseFloat(item.aptPrice || 0)
          }));
          
          setHistoricalData(chartData);
        } else {
          setHistoricalData([]);
        }
      } catch (err) {
        console.error('Error fetching historical data:', err);
        setError('Failed to fetch performance data');
        setHistoricalData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistoricalData();
  }, [walletAddress, activePeriod]);

  // Calculate performance metrics
  const performanceMetrics = React.useMemo(() => {
    if (historicalData.length < 2) return { change: 0, percentage: 0 };
    
    const firstValue = historicalData[0].value;
    const lastValue = historicalData[historicalData.length - 1].value;
    
    return {
      change: lastValue - firstValue,
      percentage: ((lastValue - firstValue) / firstValue) * 100
    };
  }, [historicalData]);

  const handlePeriodChange = (newPeriod) => {
    setActivePeriod(newPeriod);
  };

  if (isLoading) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">Portfolio Performance</h3>
          <div className="animate-pulse w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-64 flex items-center justify-center">
          <div className="animate-pulse text-gray-400">Loading performance data...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Portfolio Performance</h3>
        <div className="text-center py-8">
          <p className="text-red-500 mb-2">{error}</p>
          <button 
            onClick={() => setActivePeriod(activePeriod)} 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!walletAddress) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Portfolio Performance</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">Connect your wallet to view performance data</p>
        </div>
      </div>
    );
  }

  if (historicalData.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
        <h3 className="font-semibold text-lg mb-4">Portfolio Performance</h3>
        <div className="text-center py-8">
          <p className="text-gray-500 dark:text-gray-400">No historical data available yet</p>
          <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
            Performance tracking begins with your first transaction
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 ${className}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
        <h3 className="font-semibold text-lg">Portfolio Performance</h3>
        
        <div className="flex items-center space-x-1">
          <button 
            onClick={() => handlePeriodChange('7d')} 
            className={`px-2 py-1 text-xs rounded ${activePeriod === '7d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            1W
          </button>
          <button 
            onClick={() => handlePeriodChange('30d')} 
            className={`px-2 py-1 text-xs rounded ${activePeriod === '30d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            1M
          </button>
          <button 
            onClick={() => handlePeriodChange('90d')} 
            className={`px-2 py-1 text-xs rounded ${activePeriod === '90d' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            3M
          </button>
          <button 
            onClick={() => handlePeriodChange('all')} 
            className={`px-2 py-1 text-xs rounded ${activePeriod === 'all' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}
          >
            All
          </button>
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={historicalData}
            margin={{ top: 5, right: 5, left: 5, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.2} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9CA3AF' }}
              axisLine={{ stroke: '#9CA3AF' }}
            />
            <YAxis 
              yAxisId="left"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9CA3AF' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickFormatter={(value) => `$${value}`}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: '#9CA3AF' }}
              axisLine={{ stroke: '#9CA3AF' }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line 
              yAxisId="left"
              type="monotone" 
              dataKey="value" 
              name="Portfolio Value" 
              stroke="#3B82F6" 
              activeDot={{ r: 6 }} 
              strokeWidth={2}
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="aptPrice" 
              name="APT Price" 
              stroke="#10B981" 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
          <p className="text-sm text-gray-500 dark:text-gray-400">Performance ({activePeriod})</p>
          <p className={`text-lg font-semibold ${
            performanceMetrics.change >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {performanceMetrics.change >= 0 ? '+' : ''}{performanceMetrics.percentage.toFixed(2)}%
          </p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
          <p className="text-sm text-gray-500 dark:text-gray-400">Current Value</p>
          <p className="text-lg font-semibold">
            ${portfolio?.totalValueUSD ? parseFloat(portfolio.totalValueUSD).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;