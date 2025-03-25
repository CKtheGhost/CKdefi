// src/components/protocols/YieldComparison.jsx
import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../../context/DataContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, Spinner, Select, Toggle } from '../common';

const YieldComparison = () => {
  const { stakingData, loading, error } = useData();
  const [protocolType, setProtocolType] = useState('liquidStaking');
  const [showBlended, setShowBlended] = useState(false);
  const [timeframe, setTimeframe] = useState('current');

  // Prepare chart data
  const chartData = useMemo(() => {
    if (!stakingData || !stakingData.categorizedProtocols) return [];

    const selectedProtocols = stakingData.categorizedProtocols[protocolType] || {};
    
    return Object.entries(selectedProtocols).map(([protocol, data]) => {
      const aprValue = showBlended && data.blendedStrategy 
        ? parseFloat(data.blendedStrategy.apr) 
        : data[getProtocolCategory(protocolType)]?.apr || 0;
      
      return {
        name: protocol.charAt(0).toUpperCase() + protocol.slice(1),
        apr: aprValue,
        risk: calculateRiskScore(protocol, data),
        product: data[getProtocolCategory(protocolType)]?.product || 'Unknown'
      };
    }).sort((a, b) => b.apr - a.apr);
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
  const calculateRiskScore = (protocol, data) => {
    // Basic risk assessment based on protocol type and APR
    const baseRisk = {
      'liquidStaking': 3,
      'lending': 4,
      'dex': 6,
      'yield': 7,
      'stablecoins': 4
    }[protocolType] || 5;
    
    // Higher APR often comes with higher risk
    const aprValue = data[getProtocolCategory(protocolType)]?.apr || 0;
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

  // Timeframe options
  const timeframeOptions = [
    { value: 'current', label: 'Current' },
    { value: 'weekly', label: '7-Day Avg' },
    { value: 'monthly', label: '30-Day Avg' }
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

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!stakingData) return <div>No protocol data available</div>;

  return (
    <Card className="p-4 lg:p-6">
      <div className="flex flex-col lg:flex-row justify-between mb-6">
        <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-0">Yield Comparison</h2>
        <div className="flex flex-col md:flex-row gap-4">
          <Select 
            label="Protocol Type"
            options={protocolTypeOptions}
            value={protocolType}
            onChange={(e) => setProtocolType(e.target.value)}
            className="w-full md:w-40"
          />
          <Select 
            label="Timeframe"
            options={timeframeOptions}
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="w-full md:w-40"
          />
          <div className="flex items-center gap-2">
            <Toggle 
              label="Show Blended APR"
              checked={showBlended}
              onChange={() => setShowBlended(!showBlended)}
            />
          </div>
        </div>
      </div>

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
              label={{ 
                value: 'APR (%)', 
                angle: -90, 
                position: 'insideLeft',
                fill: '#9CA3AF' 
              }}
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

      <div className="text-xs text-gray-400 mt-4">
        {showBlended 
          ? "Showing blended strategy APR that combines multiple product yields." 
          : `Showing ${getProtocolCategory(protocolType)} APR only.`}
        {timeframe !== 'current' && " Historical data is estimated based on available information."}
      </div>
    </Card>
  );
};

export default YieldComparison;