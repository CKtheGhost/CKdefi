import React, { useState, useEffect } from 'react';

const TokenTable = ({ tokens }) => {
  const [sortField, setSortField] = useState('marketCap');
  const [sortDirection, setSortDirection] = useState('desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredTokens, setFilteredTokens] = useState([]);

  useEffect(() => {
    if (!tokens) return;

    // Filter tokens based on search query
    let filtered = tokens;
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase();
      filtered = tokens.filter(token => 
        token.name?.toLowerCase().includes(query) || 
        token.symbol?.toLowerCase().includes(query)
      );
    }

    // Sort tokens based on current sort field and direction
    filtered = [...filtered].sort((a, b) => {
      let valA = a[sortField];
      let valB = b[sortField];
      
      // Handle percentage-based fields (change24h, change7d)
      if (sortField === 'change24h' || sortField === 'change7d') {
        valA = parseFloat(valA) || 0;
        valB = parseFloat(valB) || 0;
      }

      // Handle numeric fields
      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortDirection === 'asc' ? valA - valB : valB - valA;
      }

      // Handle string fields
      if (typeof valA === 'string' && typeof valB === 'string') {
        return sortDirection === 'asc' 
          ? valA.localeCompare(valB) 
          : valB.localeCompare(valA);
      }

      return 0;
    });

    setFilteredTokens(filtered);
  }, [tokens, sortField, sortDirection, searchQuery]);

  const handleSort = (field) => {
    if (field === sortField) {
      // Toggle direction if clicking on the current sort field
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Set new field and default to descending for most fields (ascending for name/symbol)
      setSortField(field);
      setSortDirection(field === 'name' || field === 'symbol' ? 'asc' : 'desc');
    }
  };

  if (!tokens || tokens.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Token Insights</h2>
        <div className="flex justify-center items-center h-40">
          <p className="text-gray-400">No token data available</p>
        </div>
      </div>
    );
  }

  // Format currency values
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  // Format large numbers (market cap, volume)
  const formatLargeNumber = (value) => {
    if (value === undefined || value === null) return 'N/A';
    
    if (value >= 1e9) {
      return `$${(value / 1e9).toFixed(2)}B`;
    } else if (value >= 1e6) {
      return `$${(value / 1e6).toFixed(2)}M`;
    } else if (value >= 1e3) {
      return `$${(value / 1e3).toFixed(2)}K`;
    }
    
    return `$${value.toFixed(2)}`;
  };

  // Render sort arrow
  const renderSortArrow = (field) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline-block ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    );
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Token Insights</h2>
        
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tokens..."
            className="bg-gray-700 text-white px-4 py-2 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-700 rounded-lg overflow-hidden">
          <thead className="bg-gray-600">
            <tr>
              <th 
                className="px-4 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('symbol')}
              >
                <span className="flex items-center">
                  Token {renderSortArrow('symbol')}
                </span>
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('price')}
              >
                <span className="flex items-center justify-end">
                  Price {renderSortArrow('price')}
                </span>
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('change24h')}
              >
                <span className="flex items-center justify-end">
                  24h {renderSortArrow('change24h')}
                </span>
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('change7d')}
              >
                <span className="flex items-center justify-end">
                  7d {renderSortArrow('change7d')}
                </span>
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('marketCap')}
              >
                <span className="flex items-center justify-end">
                  Market Cap {renderSortArrow('marketCap')}
                </span>
              </th>
              <th 
                className="px-4 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('volume24h')}
              >
                <span className="flex items-center justify-end">
                  Volume {renderSortArrow('volume24h')}
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {filteredTokens.map((token, index) => (
              <tr key={index} className="hover:bg-gray-650">
                <td className="px-4 py-3 whitespace-nowrap">
                  <div className="flex items-center">
                    {token.icon ? (
                      <img src={token.icon} alt={token.symbol} className="w-6 h-6 mr-2 rounded-full" />
                    ) : (
                      <div className="w-6 h-6 mr-2 bg-gray-500 rounded-full flex items-center justify-center text-xs font-bold">
                        {token.symbol?.charAt(0)}
                      </div>
                    )}
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-gray-400">{token.name}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right font-medium">
                  {formatCurrency(token.price)}
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-right font-medium ${token.change24h >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change24h >= 0 ? '+' : ''}{token.change24h ? token.change24h.toFixed(2) : '0.00'}%
                </td>
                <td className={`px-4 py-3 whitespace-nowrap text-right font-medium ${token.change7d >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {token.change7d >= 0 ? '+' : ''}{token.change7d ? token.change7d.toFixed(2) : '0.00'}%
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {formatLargeNumber(token.marketCap)}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-right">
                  {formatLargeNumber(token.volume24h)}
                </td>
              </tr>
            ))}
            {filteredTokens.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-3 text-center text-gray-400">
                  No tokens found matching "{searchQuery}"
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-xs text-gray-400 text-right">
        Data source: CoinGecko API • Updated: {new Date().toLocaleTimeString()}
      </div>
    </div>
  );
};

export default TokenTable;