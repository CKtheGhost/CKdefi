import React, { useState, useEffect } from 'react';
import { useMarketData } from '../hooks/useMarketData';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtocolTable from '../components/protocols/ProtocolTable';
import YieldComparison from '../components/protocols/YieldComparison';
import ProtocolFeatures from '../components/protocols/ProtocolFeatures';
import RiskAnalysis from '../components/protocols/RiskAnalysis';
import LoadingScreen from '../components/common/LoadingScreen';
import { useNotification } from '../context/NotificationContext';

const ProtocolComparison = () => {
  const { 
    stakingData, 
    loading, 
    error, 
    fetchMarketData 
  } = useMarketData();
  const { showNotification } = useNotification();
  const [activeSection, setActiveSection] = useState('protocol-comparison');
  const [selectedProtocols, setSelectedProtocols] = useState([]);
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    // Fetch market data on component mount
    fetchMarketData();
    
    // Set up automatic refresh interval (every 5 minutes)
    const refreshInterval = setInterval(() => {
      fetchMarketData();
    }, 5 * 60 * 1000);
    
    return () => clearInterval(refreshInterval);
  }, [fetchMarketData]);

  useEffect(() => {
    // Display error notification if there's a problem
    if (error) {
      showNotification(`Error loading protocol data: ${error}`, 'error');
    }
  }, [error, showNotification]);

  useEffect(() => {
    // Initialize selected protocols when data is loaded
    if (stakingData?.protocols && Object.keys(stakingData.protocols).length > 0) {
      // Select top 3 protocols by APR
      const topProtocols = Object.entries(stakingData.protocols)
        .sort(([, a], [, b]) => parseFloat(b.staking?.apr || 0) - parseFloat(a.staking?.apr || 0))
        .slice(0, 3)
        .map(([name]) => name);
      
      setSelectedProtocols(topProtocols);
    }
  }, [stakingData]);

  // Handle section change
  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handleProtocolToggle = (protocol) => {
    setSelectedProtocols(prev => {
      if (prev.includes(protocol)) {
        // Remove protocol if already selected
        return prev.filter(p => p !== protocol);
      } else {
        // Add protocol if not selected (limit to 5 max)
        return prev.length < 5 ? [...prev, protocol] : prev;
      }
    });
  };

  const handleFilterChange = (filterType) => {
    setFilterType(filterType);
  };

  // Filter protocols based on type
  const getFilteredProtocols = () => {
    if (!stakingData?.protocols) return {};
    
    if (filterType === 'all') {
      return stakingData.protocols;
    }
    
    return Object.entries(stakingData.protocols)
      .filter(([, protocol]) => protocol.type === filterType)
      .reduce((acc, [name, protocol]) => {
        acc[name] = protocol;
        return acc;
      }, {});
  };

  // Get selected protocol data
  const getSelectedProtocolsData = () => {
    if (!stakingData?.protocols) return {};
    
    return Object.entries(stakingData.protocols)
      .filter(([name]) => selectedProtocols.includes(name))
      .reduce((acc, [name, protocol]) => {
        acc[name] = protocol;
        return acc;
      }, {});
  };

  if (loading && !stakingData?.protocols) {
    return <LoadingScreen message="Loading protocol data..." />;
  }

  return (
    <DashboardLayout activeSection={activeSection} onSectionChange={handleSectionChange}>
      <section id="protocol-comparison">
        <div className="container mx-auto px-4 py-6">
          <h2 className="text-2xl font-bold mb-6">Protocol Comparison</h2>
          
          <div className="mb-6">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
              <div className="flex gap-2">
                <button
                  onClick={() => handleFilterChange('all')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  All Protocols
                </button>
                <button
                  onClick={() => handleFilterChange('staking')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'staking' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Staking
                </button>
                <button
                  onClick={() => handleFilterChange('lending')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'lending' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Lending
                </button>
                <button
                  onClick={() => handleFilterChange('liquidity')}
                  className={`px-4 py-2 rounded-lg transition ${
                    filterType === 'liquidity' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  Liquidity
                </button>
              </div>
              
              <div className="text-sm text-gray-500">
                {selectedProtocols.length > 0 ? (
                  <span>Selected: {selectedProtocols.length} of 5 max</span>
                ) : (
                  <span>Select protocols to compare (up to 5)</span>
                )}
              </div>
            </div>
            
            <div className="bg-white shadow rounded-lg p-6">
              <ProtocolTable 
                protocols={getFilteredProtocols()} 
                selectedProtocols={selectedProtocols}
                onToggleProtocol={handleProtocolToggle}
              />
            </div>
          </div>
          
          {selectedProtocols.length > 0 && (
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">Yield Comparison</h3>
                <YieldComparison protocols={getSelectedProtocolsData()} />
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Protocol Features</h3>
                  <ProtocolFeatures protocols={getSelectedProtocolsData()} />
                </div>
                
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-semibold mb-4">Risk Analysis</h3>
                  <RiskAnalysis protocols={getSelectedProtocolsData()} />
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </DashboardLayout>
  );
};

export default ProtocolComparison;