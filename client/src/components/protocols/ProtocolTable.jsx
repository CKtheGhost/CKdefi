import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../hooks/useMarketData';
import Spinner from '../common/Spinner';
import Tooltip from '../common/Tooltip';
import { formatNumber, formatPercent } from '../../utils/formatters';

const ProtocolTable = ({ filter = 'all', sortBy = 'tvl', onProtocolSelect }) => {
  const { protocolData, loading, error } = useMarketData();
  const [protocols, setProtocols] = useState([]);
  const [sortField, setSortField] = useState(sortBy);
  const [sortDirection, setSortDirection] = useState('desc');
  
  useEffect(() => {
    if (protocolData?.protocols) {
      let filteredProtocols = Object.entries(protocolData.protocols).map(([id, data]) => ({
        id,
        name: data.name || id.charAt(0).toUpperCase() + id.slice(1),
        ...data
      }));
      
      // Apply filtering
      if (filter !== 'all') {
        filteredProtocols = filteredProtocols.filter(protocol => {
          if (filter === 'staking') return !!protocol.staking;
          if (filter === 'lending') return !!protocol.lending;
          if (filter === 'amm') return !!protocol.liquidity || !!protocol.amm;
          return true;
        });
      }
      
      // Apply sorting
      filteredProtocols.sort((a, b) => {
        let valA, valB;
        
        // Determine which field to sort by
        switch (sortField) {
          case 'tvl':
            valA = parseFloat(a.staking?.tvl || a.lending?.tvl || a.amm?.tvl || 0);
            valB = parseFloat(b.staking?.tvl || b.lending?.tvl || b.amm?.tvl || 0);
            break;
          case 'apr':
            valA = parseFloat(a.staking?.apr || a.lending?.apr || a.amm?.apr || 0);
            valB = parseFloat(b.staking?.apr || b.lending?.apr || b.amm?.apr || 0);
            break;
          case 'security':
            valA = a.securityScore || 5;
            valB = b.securityScore || 5;
            break;
          case 'name':
            return sortDirection === 'asc' 
              ? a.name.localeCompare(b.name)
              : b.name.localeCompare(a.name);
          default:
            valA = a[sortField] || 0;
            valB = b[sortField] || 0;
        }
        
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      });
      
      setProtocols(filteredProtocols);
    }
  }, [protocolData, filter, sortField, sortDirection]);
  
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">Error loading protocol data: {error}</div>;
  if (!protocols.length) return <div className="text-gray-500">No protocols found matching your criteria.</div>;
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-800">
          <tr>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Protocol
              {sortField === 'name' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('apr')}
            >
              APR
              {sortField === 'apr' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('tvl')}
            >
              TVL
              {sortField === 'tvl' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </th>
            <th 
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider cursor-pointer"
              onClick={() => handleSort('security')}
            >
              Risk/Security
              {sortField === 'security' && <span className="ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>}
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Features
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
          {protocols.map((protocol) => (
            <tr key={protocol.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {protocol.image ? (
                    <img src={protocol.image} alt={protocol.name} className="h-8 w-8 rounded-full mr-2" />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-white font-bold">
                      {protocol.name.charAt(0)}
                    </div>
                  )}
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{protocol.name}</div>
                    {protocol.category && (
                      <div className="text-xs text-gray-500 dark:text-gray-400">{protocol.category}</div>
                    )}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-semibold text-gray-900 dark:text-white">
                  {protocol.staking ? (
                    <Tooltip content="Staking APR">
                      <span className="text-blue-600 dark:text-blue-400">
                        {formatPercent(protocol.staking.apr)}
                      </span>
                    </Tooltip>
                  ) : null}
                </div>
                {protocol.lending ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span>Lending: {formatPercent(protocol.lending.apr)}</span>
                  </div>
                ) : null}
                {protocol.liquidity || protocol.amm ? (
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    <span>LP: {formatPercent(protocol.liquidity?.apr || protocol.amm?.apr)}</span>
                  </div>
                ) : null}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900 dark:text-white">
                  {formatNumber(protocol.staking?.tvl || protocol.lending?.tvl || protocol.liquidity?.tvl || 0, true)}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="relative w-full h-2 bg-gray-200 rounded">
                    <div 
                      className={`absolute top-0 left-0 h-2 rounded ${getRiskColor(protocol.riskLevel || protocol.securityScore)}`}
                      style={{ width: `${getRiskPercentage(protocol.riskLevel || protocol.securityScore)}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                    {protocol.riskLevel || getRiskLabel(protocol.securityScore)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4">
                <div className="flex flex-wrap gap-1">
                  {protocol.staking && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      Staking
                    </span>
                  )}
                  {protocol.lending && (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      Lending
                    </span>
                  )}
                  {(protocol.liquidity || protocol.amm) && (
                    <span className="px-2 py-1 text-xs rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      Liquidity
                    </span>
                  )}
                  {protocol.features?.map((feature, index) => (
                    <span key={index} className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                      {feature}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onProtocolSelect && onProtocolSelect(protocol)}
                  className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Helper functions
const getRiskColor = (risk) => {
  if (typeof risk === 'string') {
    switch (risk.toLowerCase()) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'very high': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  } else if (typeof risk === 'number') {
    if (risk >= 8) return 'bg-green-500';
    if (risk >= 6) return 'bg-yellow-500';
    if (risk >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  }
  return 'bg-yellow-500';
};

const getRiskLabel = (score) => {
  if (!score) return 'Medium';
  if (score >= 8) return 'Low';
  if (score >= 6) return 'Medium';
  if (score >= 4) return 'High';
  return 'Very High';
};

const getRiskPercentage = (risk) => {
  if (typeof risk === 'string') {
    switch (risk.toLowerCase()) {
      case 'low': return 80;
      case 'medium': return 60;
      case 'high': return 40;
      case 'very high': return 20;
      default: return 50;
    }
  } else if (typeof risk === 'number') {
    return risk * 10; // Scale from 0-10 to 0-100
  }
  return 50;
};

export default ProtocolTable;