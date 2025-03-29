import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Radar } from 'recharts';
import { useWallet } from '../../hooks/useWallet';
import { usePortfolio } from '../../hooks/usePortfolio';
import api from '../../services/api';

const RiskAnalysis = () => {
  const { walletAddress } = useParams();
  const { connected, currentWallet } = useWallet();
  const { portfolio, loadingPortfolio } = usePortfolio();
  const [riskData, setRiskData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRiskAnalysis = async () => {
      try {
        setLoading(true);
        const address = walletAddress || currentWallet;
        
        if (!address) {
          setRiskData(null);
          setLoading(false);
          return;
        }
        
        const response = await api.get(`/portfolio/${address}/risk-analysis`);
        setRiskData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching risk analysis:', err);
        setError('Failed to load risk analysis data');
      } finally {
        setLoading(false);
      }
    };

    if (connected || walletAddress) {
      fetchRiskAnalysis();
    }
  }, [walletAddress, currentWallet, connected, portfolio]);

  if (loading || loadingPortfolio) {
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

  if (!riskData) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <p className="text-gray-600">
          Connect your wallet or enter a wallet address to view risk analysis.
        </p>
      </div>
    );
  }

  const radarData = [
    { subject: 'Protocol Risk', A: riskData.riskBreakdown.protocolRisk, fullMark: 10 },
    { subject: 'Smart Contract', A: riskData.riskBreakdown.smartContractRisk, fullMark: 10 },
    { subject: 'Impermanent Loss', A: riskData.riskBreakdown.impermanentLossRisk, fullMark: 10 },
    { subject: 'Market Volatility', A: riskData.riskBreakdown.marketVolatilityRisk, fullMark: 10 },
    { subject: 'Counterparty', A: riskData.riskBreakdown.counterpartyRisk, fullMark: 10 },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Portfolio Risk Analysis</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-700">Overall Risk Score</span>
              <span className="text-lg font-bold">{riskData.riskScore}/10</span>
            </div>
            <div className="h-4 bg-gray-200 rounded-full">
              <div 
                className={`h-4 rounded-full ${getRiskColor(riskData.riskScore)}`} 
                style={{ width: `${riskData.riskScore * 10}%` }}
              ></div>
            </div>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium text-gray-800 mb-2">Risk Profile: <span className="font-bold capitalize">{riskData.riskProfile}</span></h3>
            <p className="text-gray-600 text-sm">
              {getRiskProfileDescription(riskData.riskProfile)}
            </p>
          </div>
          
          <div className="mt-6">
            <h3 className="font-medium text-gray-800 mb-2">Suggested Improvements</h3>
            <ul className="space-y-2">
              {riskData.suggestedImprovements.map((suggestion, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  <span className="text-sm text-gray-600">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="col-span-2">
          <div className="h-64 flex justify-center">
            <Radar
              data={radarData}
              width={400}
              height={250}
              outerRadius={90}
              cx={200}
              cy={130}
            >
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis angle={30} domain={[0, 10]} />
              <Radar
                name="Risk Factors"
                dataKey="A"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </Radar>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            {Object.entries(riskData.riskBreakdown).map(([key, value]) => (
              <div key={key} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <span className="text-sm text-gray-700">{formatRiskFactor(key)}</span>
                <span className={`text-sm font-medium ${getRiskTextColor(value)}`}>{value}/10</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// Helper functions
const getRiskColor = (score) => {
  if (score < 3) return 'bg-green-500';
  if (score < 7) return 'bg-yellow-500';
  return 'bg-red-500';
};

const getRiskTextColor = (score) => {
  if (score < 3) return 'text-green-600';
  if (score < 7) return 'text-yellow-600';
  return 'text-red-600';
};

const formatRiskFactor = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace('Risk', '');
};

const getRiskProfileDescription = (profile) => {
  switch (profile) {
    case 'conservative':
      return 'Your portfolio demonstrates a conservative approach, favoring established protocols and lower-risk strategies.';
    case 'balanced':
      return 'Your portfolio shows a balanced approach between growth potential and risk management.';
    case 'aggressive':
      return 'Your portfolio reflects an aggressive strategy focused on maximizing returns with higher risk tolerance.';
    default:
      return 'Portfolio risk profile not determined.';
  }
};

export default RiskAnalysis;