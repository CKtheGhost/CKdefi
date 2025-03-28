// src/components/protocols/ProtocolTable.jsx
import React from 'react';

const ProtocolTable = ({ protocols, loading }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">Protocol Comparison</h2>
      {/* Table implementation */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg">
          <thead className="bg-gray-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase">Protocol</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">APR</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">TVL</th>
              <th className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase">Risk Level</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {loading ? (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-400">Loading protocol data...</td>
              </tr>
            ) : protocols && protocols.length > 0 ? (
              protocols.map((protocol, index) => (
                <tr key={index} className="hover:bg-gray-650">
                  <td className="px-4 py-3 whitespace-nowrap font-medium text-white">{protocol.name}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right text-green-400">{protocol.apr}%</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">${protocol.tvl}</td>
                  <td className="px-4 py-3 whitespace-nowrap text-right">{protocol.riskLevel}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-4 py-3 text-center text-gray-400">No protocol data available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProtocolTable;
