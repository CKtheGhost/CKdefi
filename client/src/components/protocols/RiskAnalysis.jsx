// src/components/protocols/RiskAnalysis.jsx
import React from 'react';

const RiskAnalysis = ({ protocols }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Risk Analysis</h2>
      {/* Risk analysis implementation */}
      <div className="space-y-4">
        {protocols ? (
          protocols.map((protocol, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <span className="font-medium text-white">{protocol.name}</span>
                <span className={`text-sm px-2 py-0.5 rounded-full 
                  ${protocol.riskScore < 3 ? 'bg-green-900 text-green-300' : 
                   protocol.riskScore < 7 ? 'bg-yellow-900 text-yellow-300' : 
                   'bg-red-900 text-red-300'}`}>
                  {protocol.riskScore < 3 ? 'Low Risk' : 
                   protocol.riskScore < 7 ? 'Medium Risk' : 
                   'High Risk'}
                </span>
              </div>
              <div className="w-full bg-gray-600 h-2 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${
                    protocol.riskScore < 3 ? 'bg-green-500' : 
                    protocol.riskScore < 7 ? 'bg-yellow-500' : 
                    'bg-red-500'
                  }`}
                  style={{ width: `${protocol.riskScore * 10}%` }}
                ></div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400">Loading risk analysis...</p>
        )}
      </div>
    </div>
  );
};

export default RiskAnalysis;