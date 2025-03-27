import React, { useState, useEffect } from 'react';
import { ChevronDownIcon, ChevronUpIcon, ExternalLinkIcon, InformationCircleIcon } from '@heroicons/react/outline';
import { Tooltip } from '../common/Tooltip';

const ProtocolTable = () => {
  const [protocols, setProtocols] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortField, setSortField] = useState('blendedApr');
  const [sortDirection, setSortDirection] = useState('desc');
  const [filter, setFilter] = useState('all'); // 'all', 'liquidStaking', 'lending', 'dex', 'yield'

  useEffect(() => {
    fetchProtocolData();
  }, []);

  const fetchProtocolData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use global cached data if available
      if (window.dh?.stakingData?.protocols) {
        const protocolsData = formatProtocols(window.dh.stakingData.protocols);
        setProtocols(protocolsData);
        setLoading(false);
        return;
      }
      
      // Fetch from API if not available in cache
      const response = await fetch('/api/protocols');
      if (!response.ok) {
        throw new Error('Failed to fetch protocol data');
      }
      
      const data = await response.json();
      if (data.protocols) {
        const protocolsData = formatProtocols(data.protocols);
        setProtocols(protocolsData);
      } else {
        throw new Error('Invalid protocol data received from API');
      }
    } catch (err) {
      console.error('Error fetching protocol data:', err);
      setError(err.message);
      
      // Try to use fallback data
      try {
        if (window.stakingData?.protocols) {
          const protocolsData = formatProtocols(window.stakingData.protocols);
          setProtocols(protocolsData);
        }
      } catch (fallbackError) {
        console.error('Fallback data also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatProtocols = (protocolsObj) => {
    // Convert the object to an array and add the name as property
    return Object.entries(protocolsObj).map(([name, data]) => ({
      name,
      ...data,
      blendedApr: parseFloat(data.blendedStrategy?.apr || 0)
    }));
  };

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedProtocols = [...protocols].sort((a, b) => {
    let aValue, bValue;

    // Handle different field types
    switch (sortField) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'blendedApr':
        aValue = parseFloat(a.blendedStrategy?.apr || 0);
        bValue = parseFloat(b.blendedStrategy?.apr || 0);
        break;
      case 'stakingApr':
        aValue = parseFloat(a.staking?.apr || 0);
        bValue = parseFloat(b.staking?.apr || 0);
        break;
      case 'lendingApr':
        aValue = parseFloat(a.lending?.apr || 0);
        bValue = parseFloat(b.lending?.apr || 0);
        break;
      case 'ammApr':
        aValue = parseFloat(a.amm?.apr || 0);
        bValue = parseFloat(b.amm?.apr || 0);
        break;
      default:
        aValue = a[sortField];
        bValue = b[sortField];
    }

    // Handle string comparison
    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return sortDirection === 'asc' 
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    // Handle numeric comparison
    return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
  });

  // Filter protocols based on selected category
  const filteredProtocols = sortedProtocols.filter(protocol => {
    if (filter === 'all') return true;
    
    switch (filter) {
      case 'liquidStaking':
        return !!protocol.staking;
      case 'lending':
        return !!protocol.lending;
      case 'dex':
        return !!protocol.amm;
      case 'yield':
        return !!protocol.yield;
      default:
        return true;
    }
  });

  const renderSortIcon = (field) => {
    if (sortField !== field) {
      return <ChevronDownIcon className="w-4 h-4 opacity-40" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUpIcon className="w-4 h-4" />
      : <ChevronDownIcon className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="h-8 bg-gray-700 rounded w-1/4 mb-4"></div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-700">
            <thead>
              <tr>
                {['Protocol', 'Blended APR', 'Staking APR', 'Lending APR', 'AMM APR'].map((header, idx) => (
                  <th key={idx} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    <div className="h-4 bg-gray-700 rounded w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {[1, 2, 3, 4, 5].map((_, idx) => (
                <tr key={idx}>
                  {[1, 2, 3, 4, 5].map((_, cellIdx) => (
                    <td key={cellIdx} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-gray-700 rounded w-16"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  if (error && protocols.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <h3 className="text-lg font-medium text-red-400 mb-2">Failed to load protocol data</h3>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white font-medium"
          onClick={fetchProtocolData}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Protocol Comparison</h2>
        <div className="flex mt-2 lg:mt-0">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
                filter === 'all' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('liquidStaking')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'liquidStaking' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Staking
            </button>
            <button
              onClick={() => setFilter('lending')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'lending' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Lending
            </button>
            <button
              onClick={() => setFilter('dex')}
              className={`px-4 py-2 text-sm font-medium ${
                filter === 'dex' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              DEX
            </button>
            <button
              onClick={() => setFilter('yield')}
              className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
                filter === 'yield' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Yield
            </button>
          </div>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-700 bg-opacity-40">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                <div className="flex items-center space-x-1">
                  <span>Protocol</span>
                  {renderSortIcon('name')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('blendedApr')}
              >
                <div className="flex items-center space-x-1">
                  <span>Blended APR</span>
                  {renderSortIcon('blendedApr')}
                  <Tooltip content="Combined APR across all protocol services">
                    <InformationCircleIcon className="w-4 h-4 text-gray-400" />
                  </Tooltip>
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('stakingApr')}
              >
                <div className="flex items-center space-x-1">
                  <span>Staking APR</span>
                  {renderSortIcon('stakingApr')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('lendingApr')}
              >
                <div className="flex items-center space-x-1">
                  <span>Lending APR</span>
                  {renderSortIcon('lendingApr')}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('ammApr')}
              >
                <div className="flex items-center space-x-1">
                  <span>AMM APR</span>
                  {renderSortIcon('ammApr')}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                Products
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredProtocols.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-8 text-center text-gray-400">
                  {filter !== 'all' ? 
                    `No protocols found in the ${filter} category.` : 
                    'No protocols found.'}
                </td>
              </tr>
            ) : (
              filteredProtocols.map((protocol) => (
                <tr key={protocol.name} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 bg-gray-700 rounded-full flex items-center justify-center">
                        <span className="text-lg font-bold text-blue-400">
                          {protocol.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-white capitalize">
                          {protocol.name}
                        </div>
                        <a 
                          href={`https://explorer.aptoslabs.com/account/${protocol.contractAddress || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-400 hover:text-blue-300 flex items-center mt-1"
                        >
                          View Contract <ExternalLinkIcon className="h-3 w-3 ml-1" />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-blue-400">
                      {protocol.blendedStrategy?.apr ? `${protocol.blendedStrategy.apr}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {protocol.staking?.apr ? `${protocol.staking.apr}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {protocol.lending?.apr ? `${protocol.lending.apr}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-300">
                      {protocol.amm?.apr ? `${protocol.amm.apr}%` : 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-wrap gap-1">
                      {protocol.staking && (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-900 text-blue-300">
                          {protocol.staking.product || 'Staking'}
                        </span>
                      )}
                      {protocol.lending && (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-900 text-green-300">
                          {protocol.lending.product || 'Lending'}
                        </span>
                      )}
                      {protocol.amm && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-300">
                          {protocol.amm.product || 'AMM'}
                        </span>
                      )}
                      {protocol.yield && (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-900 text-yellow-300">
                          {protocol.yield.product || 'Yield'}
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProtocolTable;