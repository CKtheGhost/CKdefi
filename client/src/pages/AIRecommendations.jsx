import React, { useState } from 'react';

const AIRecommendations = () => {
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);
  
  // Simple form submission handler
  const handleFormSubmit = (formData) => {
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setRecommendation({
        title: "Balanced Yield Strategy",
        summary: "A diversified approach with liquid staking and some DEX liquidity for higher returns.",
        totalApr: "7.8",
        allocation: [
          { protocol: "Amnis", product: "Liquid Staking", percentage: 40, expectedApr: 7.2 },
          { protocol: "Thala", product: "Liquid Staking", percentage: 30, expectedApr: 7.5 },
          { protocol: "PancakeSwap", product: "AMM Liquidity", percentage: 20, expectedApr: 10.2 },
          { protocol: "Ditto", product: "Liquid Staking", percentage: 10, expectedApr: 7.8 }
        ]
      });
      setLoading(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">AI Investment Recommendations</h1>
      
      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <h2 className="text-xl font-bold mb-4 text-white">Generate Recommendation</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          handleFormSubmit({
            amount: e.target.amount.value,
            riskProfile: e.target.riskProfile.value
          });
        }}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-300 mb-1">
                Investment Amount (APT)
              </label>
              <input
                type="number"
                name="amount"
                id="amount"
                className="bg-gray-700 text-white block w-full p-2.5 rounded-md"
                placeholder="100"
                defaultValue="100"
              />
            </div>
            
            <div>
              <label htmlFor="riskProfile" className="block text-sm font-medium text-gray-300 mb-1">
                Risk Profile
              </label>
              <select
                id="riskProfile"
                name="riskProfile"
                className="bg-gray-700 text-white block w-full p-2.5 rounded-md"
                defaultValue="balanced"
              >
                <option value="conservative">Conservative</option>
                <option value="balanced">Balanced</option>
                <option value="aggressive">Aggressive</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-md"
              disabled={loading}
            >
              {loading ? "Generating..." : "Generate Recommendation"}
            </button>
          </div>
        </form>
      </div>
      
      {recommendation && (
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">{recommendation.title}</h2>
          <p className="text-gray-300 mb-6">{recommendation.summary}</p>
          
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-medium text-gray-200">Asset Allocation</h3>
            <div className="text-2xl font-bold text-blue-400">{recommendation.totalApr}% APR</div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Protocol</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Allocation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Expected APR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {recommendation.allocation.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{item.protocol}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.product}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{item.percentage}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400">{item.expectedApr}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-md shadow-md">
              Execute Strategy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;