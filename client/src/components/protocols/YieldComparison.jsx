import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import api from '../../services/api';

const YieldComparison = ({ riskProfile = 'balanced' }) => {
  const [yieldData, setYieldData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'staking', 'lending', 'liquidity'
  const [sortBy, setSortBy] = useState('apr'); // 'apr', 'risk', 'tvl'

  useEffect(() => {
    const fetchYieldData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/staking/rates');
        
        if (response.data && response.data.protocols) {
          // Transform the data for the chart
          const transformedData = [];
          
          Object.entries(response.data.protocols).forEach(([protocol, data]) => {
            // Add staking products if they exist
            if (data.staking && data.staking.apr) {
              transformedData.push({
                protocol,
                type: 'staking',
                product: data.staking.product || 'Staking',
                apr: parseFloat(data.staking.apr),
                riskScore: getRiskScore(protocol, 'staking'),
                tvl: data.staking.tvl || 0
              });
            }
            
            // Add lending products if they exist
            if (data.lending && data.lending.apr) {
              transformedData.push({
                protocol,
                type: 'lending',
                product: data.lending.product || 'Lending',
                apr: parseFloat(data.lending.apr),
                riskScore: getRiskScore(protocol, 'lending'),
                tvl: data.lending.tvl || 0
              });
            }
            
            // Add liquidity products if they exist
            if (data.liquidity && data.liquidity.apr) {
              transformedData.push({
                protocol,
                type: 'liquidity',
                product: data.liquidity.product || 'Liquidity',
                apr: parseFloat(data.liquidity.apr),
                riskScore: getRiskScore(protocol, 'liquidity'),
                tvl: data.liquidity.tvl || 0
              });
            }
          });
          
          setYieldData(transformedData);
        }
        
        setError(null);
      } catch (err) {
        console.error('Error fetching yield data:', err);
        setError('Failed to load protocol yield data');
      } finally {
        setLoading(false);
      }
    };

    fetchYieldData();
  }, []);

  // Filter and sort data
  const getFilteredAndSortedData = () => {
    let filteredData = [...yieldData];
    
    // Apply filter
    if (filter !== 'all') {
      filteredData = filteredData.filter(item => item.type === filter);
    }
    
    // Apply sort
    filteredData.sort((a, b) => {
      if (sortBy === 'apr') {
        return b.apr - a.apr; // Higher APR first
      } else if (sortBy === 'risk') {
        return a.riskScore - b.riskScore; // Lower risk first
      } else if (sortBy === 'tvl') {
        return b.tvl - a.tvl; // Higher TVL first
      }
      return 0;
    });
    
    // Limit to top 10
    return filteredData.slice(0, 10);
  };

  const filteredData = getFilteredAndSortedData();
  
  // Function to get risk score based on protocol and type
  function getRiskScore(protocol, type) {
    // This could be expanded to use data from the backend
    const riskScores = {
      'amnis': { staking: 3, lending: 4 },
      'thala': { staking: 3, lending: 4 },
      'tortuga': { staking: 3 },
      'ditto': { staking: 4 },
      'aries': { lending: 5 },
      'echo': { lending: 6 },
      'pancakeswap': { liquidity: 7 },
      'liquidswap': { liquidity: 7 },
      'cetus': { liquidity: 7 }
    };
    
    return riskScores[protocol]?.[type] || 5;
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mt-4">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-xl font-semibold mb-2 md:mb-0">Protocol Yield Comparison</h2>
        
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center">
            <label htmlFor="filter" className="mr-2 text-sm text-gray-600">Filter:</label>
            <select
              id="filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="all">All Products</option>
              <option value="staking">Staking Only</option>
              <option value="lending">Lending Only</option>
              <option value="liquidity">Liquidity Only</option>
            </select>
          </div>
          
          <div className="flex items-center ml-0 md:ml-4">
            <label htmlFor="sortBy" className="mr-2 text-sm text-gray-600">Sort By:</label>
            <select
              id="sortBy"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-1 border rounded text-sm"
            >
              <option value="apr">Highest APR</option>
              <option value="risk">Lowest Risk</option>
              <option value="tvl">Highest TVL</option>
            </select>
          </div>
        </div>
      </div>
      
      {filteredData.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600">No yield data available for the selected filters.</p>
        </div>
      ) : (
        <>
          <div className="h-80 mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={filteredData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="protocol" />
                <YAxis 
                  label={{ value: 'APR (%)', angle: -90, position: 'insideLeft' }} 
                  domain={[0, 'dataMax + 5']}
                />
                <Tooltip
                  formatter={(value, name, props) => {
                    if (name === 'apr') return [`${value.toFixed(2)}%`, 'APR'];
                    if (name === 'riskScore') return [`${value}/10`, 'Risk Score'];
                    return [value, name];
                  }}
                  labelFormatter={(label) => {
                    const item = filteredData.find(d => d.protocol === label);
                    return `${item.protocol} (${item.product})`;
                  }}
                />
                <Legend />
                <Bar dataKey="apr" name="APR" fill="#3b82f6" />
                <Bar dataKey="riskScore" name="Risk Score" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Detailed Comparison</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Protocol</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">APR</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Risk Score</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TVL</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredData.map((item, index) => (
                    <tr key={`${item.protocol}-${item.type}`} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">{item.protocol}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.product}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{item.type}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">{item.apr.toFixed(2)}%</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span 
                          className={`px-2 py-1 text-xs rounded-full ${getRiskBadgeColor(item.riskScore)}`}
                        >
                          {item.riskScore}/10
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${formatNumber(item.tvl)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
      
      <div className="mt-6 bg-blue-50 p-4 rounded-lg">
        <h3 className="text-md font-medium text-blue-800 mb-2">Recommendation for {riskProfile} profile</h3>
        <p className="text-sm text-blue-700">
          {getRecommendationText(riskProfile, filteredData)}
        </p>
      </div>
    </div>
  );
};

// Helper functions
const getRiskBadgeColor = (score) => {
  if (score <= 3) return 'bg-green-100 text-green-800';
  if (score <= 6) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
};

const formatNumber = (num) => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
};

const getRecommendationText = (riskProfile, data) => {
  if (data.length === 0) return "No recommendations available with the current filter settings.";
  
  switch (riskProfile) {
    case 'conservative':
      const lowRiskOptions = data.filter(item => item.riskScore <= 4).sort((a, b) => b.apr - a.apr);
      if (lowRiskOptions.length > 0) {
        const bestOption = lowRiskOptions[0];
        return `For your conservative profile, we recommend ${bestOption.protocol}'s ${bestOption.product} with ${bestOption.apr.toFixed(2)}% APR as your primary strategy while maintaining a focus on capital preservation.`;
      }
      return "Consider staking options with larger established protocols to minimize risk while still earning yield.";
      
    case 'balanced':
      const balancedOptions = data.filter(item => item.riskScore >= 3 && item.riskScore <= 6);
      if (balancedOptions.length > 0) {
        const sorted = balancedOptions.sort((a, b) => b.apr - a.apr);
        const top = sorted[0];
        return `For your balanced profile, ${top.protocol}'s ${top.product} offers a good risk-reward ratio with ${top.apr.toFixed(2)}% APR. Consider dividing investments across 2-3 protocols for diversification.`;
      }
      return "Aim for a mix of staking and lending protocols to balance security with yield optimization.";
      
    case 'aggressive':
      const highYieldOptions = data.sort((a, b) => b.apr - a.apr);
      if (highYieldOptions.length > 0) {
        const top = highYieldOptions[0];
        const second = highYieldOptions[1] || null;
        return `For your aggressive profile, consider ${top.protocol}'s ${top.product} with ${top.apr.toFixed(2)}% APR${second ? ` and ${second.protocol}'s ${second.product} (${second.apr.toFixed(2)}% APR)` : ''} to maximize your returns. Remember to monitor these positions regularly.`;
      }
      return "Look into liquidity provisions and lending platforms to maximize yield, but be prepared for higher volatility.";
      
    default:
      return "Connect your wallet to see personalized recommendations based on your risk profile.";
  }
};

export default YieldComparison;