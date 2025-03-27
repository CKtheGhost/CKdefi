import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const YieldComparison = ({ stakingData }) => {
  const [protocolType, setProtocolType] = useState('liquidStaking');
  const [showBlended, setShowBlended] = useState(false);
  const [timeframe, setTimeframe] = useState('current');

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!stakingData || !stakingData.protocols) return [];

    // For demo, use direct protocol data
    const protocols = stakingData?.protocols || {};
    
    return Object.entries(protocols)
      .filter(([_, data]) => {
        // Filter based on protocol type
        switch (protocolType) {
          case 'liquidStaking': return !!data.staking;
          case 'lending': return !!data.lending;
          case 'dex': return !!data.amm;
          case 'yield': return !!data.yield;
          default: return true;
        }
      })
      .map(([protocol, data]) => {
        const category = getProtocolCategory(protocolType);
        const aprValue = showBlended && data.blendedStrategy 
          ? parseFloat(data.blendedStrategy.apr || 0) 
          : parseFloat(data[category]?.apr || 0);
        
        return {
          name: protocol.charAt(0).toUpperCase() + protocol.slice(1),
          apr: aprValue,
          risk: calculateRiskScore(protocol, data, protocolType),
          product: data[category]?.product || 'Unknown'
        };
      })
      .sort((a, b) => b.apr - a.apr)
      .slice(0, 10); // Top 10 for readability
  }, [stakingData, protocolType, showBlended, timeframe]);

  // Helper to get proper category field based on protocolType
  const getProtocolCategory = (type) => {
    const categoryMap = {
      'liquidStaking': 'staking',
      'lending': 'lending',
      'dex': 'amm',
      'yield': 'yield',
      'stablecoins': 'stablecoin'
    };
    return categoryMap[type] || type;
  };

  // Calculate risk score for protocol (1-10)
  const calculateRiskScore = (protocol, data, type) => {
    // Basic risk assessment based on protocol type and APR
    const baseRisk = {
      'liquidStaking': 3,
      'lending': 4,
      'dex': 6,
      'yield': 7,
      'stablecoins': 4
    }[type] || 5;
    
    // Higher APR often comes with higher risk
    const category = getProtocolCategory(type);
    const aprValue = parseFloat(data[category]?.apr || 0);
    const aprRiskFactor = Math.min(aprValue / 10, 3); // Max +3 for extremely high APR
    
    return Math.min(baseRisk + aprRiskFactor, 10);
  };
  
  // Protocol type options
  const protocolTypeOptions = [
    { value: 'liquidStaking', label: 'Liquid Staking' },
    { value: 'lending', label: 'Lending' },
    { value: 'dex', label: 'DEXes/AMMs' },
    { value: 'yield', label: 'Yield Farming' },
    { value: 'stablecoins', label: 'Stablecoins' }
  ];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="font-bold text-blue-400">{data.name}</p>
          <p className="text-sm text-green-400">APR: {data.apr.toFixed(2)}%</p>
          <p className="text-sm text-yellow-400">Risk: {data.risk.toFixed(1)}/10</p>
          <p className="text-sm text-gray-300 mt-1">{data.product}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-0 text-white">Yield Comparison</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Protocol Type</label>
            <select
              value={protocolType}
              onChange={(e) => setProtocolType(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-300"
            >
              {protocolTypeOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Timeframe</label>
            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-md py-2 px-3 text-gray-300"
            >
              <option value="current">Current</option>
              <option value="weekly">7-Day Avg</option>
              <option value="monthly">30-Day Avg</option>
            </select>
          </div>
          
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={showBlended}
                  onChange={() => setShowBlended(!showBlended)}
                />
                <div className={`block w-10 h-6 rounded-full ${showBlended ? 'bg-blue-600' : 'bg-gray-600'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition ${showBlended ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <div className="ml-3 text-sm text-gray-300">Show Blended APR</div>
            </label>
          </div>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#9CA3AF' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <YAxis 
                tick={{ fill: '#9CA3AF' }}
                axisLine={{ stroke: '#4B5563' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend 
                wrapperStyle={{ paddingTop: 10 }}
                formatter={(value) => <span className="text-gray-300">{value}</span>}
              />
              <Bar 
                dataKey="apr" 
                name="APR (%)" 
                fill="#3B82F6" 
                radius={[4, 4, 0, 0]} 
                barSize={30}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-center h-60">
          <p className="text-gray-400">No data available for the selected protocol type</p>
        </div>
      )}

      <div className="text-xs text-gray-400 mt-4">
        {showBlended 
          ? "Showing blended strategy APR that combines multiple product yields." 
          : `Showing ${getProtocolCategory(protocolType)} APR only.`}
        {timeframe !== 'current' && " Historical data is estimated based on available information."}
      </div>
    </div>
  );
};

export default YieldComparison;