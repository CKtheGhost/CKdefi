import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import { ExternalLinkIcon, FilterIcon, RefreshIcon } from '@heroicons/react/outline';

const TransactionHistory = ({ walletAddress }) => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'staking', 'lending', 'swap'

  useEffect(() => {
    if (walletAddress) {
      fetchTransactionHistory(walletAddress);
    }
  }, [walletAddress]);

  const fetchTransactionHistory = async (address) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to use portfolio data cache from parent components
      if (window.dh?.portfolioData?.recentTransactions) {
        setTransactions(window.dh.portfolioData.recentTransactions);
        setLoading(false);
        return;
      }
      
      // Fetch from API if not available in cache
      const response = await fetch(`/api/wallet/${address}/transactions`);
      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }
      
      const data = await response.json();
      setTransactions(data.transactions || []);
    } catch (err) {
      console.error('Error fetching transaction history:', err);
      setError(err.message);
      
      // Try to use fallback from global state
      if (window.dh?.portfolioData?.portfolio?.recentTransactions) {
        setTransactions(window.dh.portfolioData.portfolio.recentTransactions);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    if (walletAddress) {
      fetchTransactionHistory(walletAddress);
    }
  };

  const getTransactionTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'staking':
        return (
          <div className="bg-blue-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 9a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V9z" />
              <path d="M5 3a2 2 0 012-2h6a2 2 0 012 2v6a2 2 0 01-2 2H7a2 2 0 01-2-2V3z" />
            </svg>
          </div>
        );
      case 'unstaking':
        return (
          <div className="bg-purple-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-purple-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
        );
      case 'swap':
        return (
          <div className="bg-green-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          </div>
        );
      case 'add liquidity':
      case 'remove liquidity':
        return (
          <div className="bg-yellow-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zm7-10a1 1 0 01.707.293l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 8l-3.293-3.293A1 1 0 0112 3z" clipRule="evenodd" />
            </svg>
          </div>
        );
      case 'transfer':
        return (
          <div className="bg-indigo-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
              <path d="M8 5a1 1 0 100 2h5.586l-1.293 1.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L13.586 5H8zM12 15a1 1 0 100-2H6.414l1.293-1.293a1 1 0 10-1.414-1.414l-3 3a1 1 0 000 1.414l3 3a1 1 0 001.414-1.414L6.414 15H12z" />
            </svg>
          </div>
        );
      default:
        return (
          <div className="bg-gray-500 bg-opacity-20 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
          </div>
        );
    }
  };

  const filteredTransactions = transactions.filter(tx => {
    if (filter === 'all') return true;
    return tx.type.toLowerCase().includes(filter.toLowerCase());
  });

  if (loading) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 animate-pulse">
        <div className="flex justify-between items-center mb-4">
          <div className="h-6 bg-gray-700 rounded w-1/3"></div>
          <div className="h-8 bg-gray-700 rounded w-24"></div>
        </div>
        <div className="space-y-3">
          {[1, 2, 3, 4].map((_, idx) => (
            <div key={idx} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-700 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-24"></div>
                  <div className="h-3 bg-gray-700 rounded w-16"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error && transactions.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4">
        <div className="text-center py-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-400">Error Loading Transactions</h3>
          <p className="text-gray-400 mt-1">{error}</p>
          <button 
            className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
            onClick={handleRefresh}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-white">Transaction History</h2>
        <div className="flex space-x-2">
          <div className="relative">
            <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm flex items-center" onClick={() => setFilter(filter === 'all' ? 'staking' : 'all')}>
              <FilterIcon className="h-4 w-4 mr-1" />
              <span>{filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
            </button>
            {filter !== 'all' && (
              <div className="absolute top-0 right-0 -mt-1 -mr-1 w-3 h-3 bg-blue-500 rounded-full border border-gray-800"></div>
            )}
          </div>
          <button 
            className="p-1.5 bg-gray-700 hover:bg-gray-600 rounded-lg"
            onClick={handleRefresh}
            title="Refresh"
          >
            <RefreshIcon className="h-5 w-5 text-gray-300" />
          </button>
        </div>
      </div>
      
      {transactions.length === 0 ? (
        <div className="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 className="text-gray-400 font-medium">No transactions found</h3>
          <p className="text-gray-500 text-sm mt-1">This wallet has no transaction history.</p>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-96 pr-1">
          {filteredTransactions.map((tx, idx) => (
            <div 
              key={tx.hash || idx} 
              className={`flex items-center justify-between py-3 ${idx !== 0 ? 'border-t border-gray-700' : ''}`}
            >
              <div className="flex items-center space-x-3">
                {getTransactionTypeIcon(tx.type)}
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium text-white">{tx.type}</h4>
                    {tx.protocol && (
                      <span className="ml-2 text-xs py-0.5 px-2 bg-blue-900 bg-opacity-40 text-blue-400 rounded-full">
                        {tx.protocol}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-gray-400">
                    <span title={new Date(tx.timestamp).toLocaleString()}>
                      {formatDistance(new Date(tx.timestamp), new Date(), { addSuffix: true })}
                    </span>
                    {tx.hash && (
                      <a 
                        href={`https://explorer.aptoslabs.com/txn/${tx.hash}?network=mainnet`}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300"
                      >
                        <ExternalLinkIcon className="h-3.5 w-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
                              <div className="text-right">
                <div className={`font-medium ${tx.success ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.impactInApt && (
                    <span>{tx.impactInApt} APT</span>
                  )}
                  {tx.valueUSD && tx.impactInApt && (
                    <span className="text-xs text-gray-400 block">${parseFloat(tx.valueUSD).toFixed(2)}</span>
                  )}
                </div>
                {tx.success === false && (
                  <span className="text-xs text-red-400">Failed</span>
                )}
                {tx.gasUsed && (
                  <span className="text-xs text-gray-500 block">Gas: {parseInt(tx.gasUsed).toLocaleString()}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      
      {transactions.length > 0 && filteredTransactions.length === 0 && (
        <div className="text-center py-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <h3 className="text-gray-400 font-medium">No matching transactions</h3>
          <p className="text-gray-500 text-sm mt-1">Try changing your filter criteria.</p>
          <button 
            className="mt-3 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm font-medium"
            onClick={() => setFilter('all')}
          >
            Show All Transactions
          </button>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;