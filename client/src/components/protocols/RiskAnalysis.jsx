import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const RiskAnalysis = ({ protocols }) => {
  const [riskData, setRiskData] = useState([]);
  const [selectedMetric, setSelectedMetric] = useState('overall');
  const [tooltipContent, setTooltipContent] = useState(null);

  // Define risk metrics
  const riskMetrics = [
    { id: 'overall', label: 'Overall Risk Score' },
    { id: 'smart_contract', label: 'Smart Contract Risk' },
    { id: 'centralization', label: 'Centralization Risk' },
    { id: 'liquidity', label: 'Liquidity Risk' },
    { id: 'volatility', label: 'Volatility Risk' },
    { id: 'regulatory', label: 'Regulatory Risk' }
  ];

  // Risk explanations for each metric
  const riskExplanations = {
    overall: 'An aggregated risk score based on all risk factors. Lower score indicates lower risk.',
    smart_contract: 'Risk related to potential smart contract vulnerabilities, audits, and code quality.',
    centralization: 'Risk related to centralized control, admin keys, and governance structure.',
    liquidity: 'Risk related to available liquidity, withdrawal limits, and slippage.',
    volatility: 'Risk related to price volatility and potential impermanent loss.',
    regulatory: 'Risk related to regulatory compliance and potential legal issues.'
  };

  // Risk color scheme (from low to high risk)
  const riskColorScale = [
    '#10B981', // Green (low risk)
    '#84CC16', // Lime
    '#FBBF24', // Amber
    '#F97316', // Orange
    '#EF4444'  // Red (high risk)
  ];

  // Calculate risk score color based on value (0-100)
  const getRiskColor = (value) => {
    const index = Math.min(Math.floor(value / 20), 4);
    return riskColorScale[index];
  };

  // Generate risk data for protocols
  useEffect(() => {
    if (!protocols || protocols.length === 0) return;

    // Generate risk data for each protocol
    const data = protocols.map(protocol => {
      // Base risk on protocol type and available data
      const hasLending = !!protocol.lending;
      const hasAmm = !!protocol.amm;
      const hasStaking = !!protocol.staking;
      const hasYield = !!protocol.yield;
      
      // Calculate protocol-specific base scores
      // Lower is better (less risky)
      let smartContractRisk = 40;
      let centralizationRisk = 50;
      let liquidityRisk = 50;
      let volatilityRisk = 50;
      let regulatoryRisk = 40;
      
      // Protocol name to lowercase for consistency
      const protocolName = protocol.name.toLowerCase();
      
      // Adjust risks based on protocol type
      if (protocolName.includes('amnis')) {
        smartContractRisk = 30; // Better auditing
        centralizationRisk = 45;
        liquidityRisk = 35;
      } else if (protocolName.includes('thala')) {
        smartContractRisk = 32;
        centralizationRisk = 40;
        liquidityRisk = 30;
      } else if (protocolName.includes('pancake')) {
        smartContractRisk = 25; // Many audits, established
        centralizationRisk = 35;
        liquidityRisk = 20; // High liquidity
      } else if (protocolName.includes('cetus')) {
        smartContractRisk = 35;
        volatilityRisk = 60; // Concentrated liquidity has higher impermanent loss risk
      } else if (protocolName.includes('tortuga')) {
        smartContractRisk = 38;
        centralizationRisk = 48;
      }
      
      // Adjust risks based on protocol features
      if (hasLending) {
        liquidityRisk += 10; // Lending protocols have higher liquidity risk
        regulatoryRisk += 15; // Higher regulatory risk for lending
      }
      
      if (hasAmm) {
        volatilityRisk += 15; // AMMs have impermanent loss risk
        liquidityRisk -= 5; // Usually more liquid
      }
      
      if (hasStaking) {
        liquidityRisk -= 10; // Usually more stable liquidity
        volatilityRisk -= 5; // Lower volatility
        centralizationRisk += 5; // Sometimes more centralized
      }
      
      if (hasYield) {
        smartContractRisk += 10; // More complex, higher risk
        volatilityRisk += 10; // Higher volatility in yields
      }
      
      // Calculate overall risk (weighted average)
      const overallRisk = (
        smartContractRisk * 0.3 +
        centralizationRisk * 0.2 +
        liquidityRisk * 0.2 +
        volatilityRisk * 0.2 +
        regulatoryRisk * 0.1
      ).toFixed(0);
      
      // Make sure all risks are within 0-100 range
      return {
        name: protocol.name,
        overall: Math.min(100, Math.max(0, overallRisk)),
        smart_contract: Math.min(100, Math.max(0, smartContractRisk)),
        centralization: Math.min(100, Math.max(0, centralizationRisk)),
        liquidity: Math.min(100, Math.max(0, liquidityRisk)),
        volatility: Math.min(100, Math.max(0, volatilityRisk)),
        regulatory: Math.min(100, Math.max(0, regulatoryRisk)),
        // Include protocol features for reference
        features: {
          hasLending,
          hasAmm,
          hasStaking,
          hasYield
        }
      };
    });
    
    // Sort data by the selected risk metric (ascending, lower risk first)
    const sortedData = [...data].sort((a, b) => a[selectedMetric] - b[selectedMetric]);
    setRiskData(sortedData);
  }, [protocols, selectedMetric]);

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      
      return (
        <div className="bg-gray-800 border border-gray-700 p-3 rounded shadow-lg">
          <p className="font-semibold text-white">{data.name}</p>
          <p className="text-sm text-gray-300">
            {riskMetrics.find(m => m.id === selectedMetric)?.label}: <span className="font-medium text-white">{data[selectedMetric]}/100</span>
          </p>
          <div className="mt-1 text-xs text-gray-400">
            {data.features.hasStaking && <span className="mr-2">Staking</span>}
            {data.features.hasLending && <span className="mr-2">Lending</span>}
            {data.features.hasAmm && <span className="mr-2">AMM</span>}
            {data.features.hasYield && <span className="mr-2">Yield</span>}
          </div>
        </div>
      );
    }
    
    return null;
  };

  // Handle metric selection
  const handleMetricChange = (metricId) => {
    setSelectedMetric(metricId);
    // Re-sort data based on new metric
    const sortedData = [...riskData].sort((a, b) => a[metricId] - b[metricId]);
    setRiskData(sortedData);
  };

  // Show risk explanation when hovering over metric
  const handleMetricHover = (metricId) => {
    setTooltipContent(riskExplanations[metricId]);
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-xl font-bold text-white mb-3 md:mb-0">Risk Analysis</h2>
        
        <div className="flex flex-wrap gap-2 relative">
          {riskMetrics.map((metric) => (
            <button
              key={metric.id}
              onClick={() => handleMetricChange(metric.id)}
              onMouseEnter={() => handleMetricHover(metric.id)}
              onMouseLeave={() => setTooltipContent(null)}
              className={`px-3 py-1 text-xs rounded-full whitespace-nowrap ${
                selectedMetric === metric.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {metric.label}
            </button>
          ))}
          
          {tooltipContent && (
            <div className="absolute -bottom-14 right-0 left-0 bg-gray-700 p-2 rounded text-xs text-gray-300 shadow-lg z-10">
              {tooltipContent}
            </div>
          )}
        </div>
      </div>
      
      {riskData.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={riskData}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#374151" />
              <XAxis 
                type="number" 
                domain={[0, 100]} 
                tickCount={6} 
                tick={{ fill: '#9CA3AF' }} 
              />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fill: '#D1D5DB' }} 
                width={80} 
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey={selectedMetric} radius={[0, 4, 4, 0]}>
                {riskData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getRiskColor(entry[selectedMetric])} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-gray-700 p-6 rounded-lg flex items-center justify-center h-60">
          <p className="text-gray-400">No protocol data available for risk analysis</p>
        </div>
      )}
      
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Low Risk (&lt;40)</h3>
          <p className="text-sm text-gray-300">Protocols with robust audits, high liquidity, and established track records. These typically have minimal smart contract risk and strong governance structures.</p>
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Lower potential for loss</span>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">Medium Risk (40-70)</h3>
          <p className="text-sm text-gray-300">Protocols with moderate risk factors, such as fewer audits, medium-sized liquidity pools, or more complex features.</p>
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Balanced risk-reward profile</span>
          </div>
        </div>
        
        <div className="bg-gray-700 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-2 text-white">High Risk (&gt;70)</h3>
          <p className="text-sm text-gray-300">Protocols with higher risk factors such as limited audits, complex mechanisms, or higher regulatory concerns. May offer higher APR but with increased risk.</p>
          <div className="flex items-center mt-2">
            <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-300 text-sm">Higher potential for loss</span>
          </div>
        </div>
      </div>
      
      <div className="mt-6 bg-gray-700 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-white">Risk Factors Explained</h3>
        <ul className="space-y-2 text-sm text-gray-300">
          <li><span className="font-medium text-white">Smart Contract Risk:</span> Vulnerability to exploits, audit quality, and code complexity.</li>
          <li><span className="font-medium text-white">Centralization Risk:</span> The degree to which the protocol is controlled by a small group of individuals or entities.</li>
          <li><span className="font-medium text-white">Liquidity Risk:</span> Risk of not being able to exit positions without significant slippage or loss.</li>
          <li><span className="font-medium text-white">Volatility Risk:</span> Exposure to price fluctuations and impermanent loss in AMMs.</li>
          <li><span className="font-medium text-white">Regulatory Risk:</span> Potential for adverse regulatory action affecting the protocol.</li>
        </ul>
        
        <p className="mt-4 text-sm text-gray-400 italic">Note: Risk scores are estimates based on available data and known protocol characteristics. Always conduct your own research before investing.</p>
      </div>
    </div>
  );
};

export default RiskAnalysis;