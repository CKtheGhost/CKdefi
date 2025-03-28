// src/components/protocols/YieldComparison.jsx
import React from 'react';

const YieldComparison = ({ stakingData }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Yield Comparison</h2>
      {/* Chart or visualization implementation */}
      <div className="h-64 bg-gray-700 rounded-lg flex items-center justify-center">
        {stakingData ? (
          <div>Yield visualization would go here</div>
        ) : (
          <p className="text-gray-400">Loading yield data...</p>
        )}
      </div>
    </div>
  );
};

export default YieldComparison;