import React, { useState, useEffect } from 'react';
import { useMarketData } from '../../hooks/useMarketData';
import Card from '../common/Card';
import Spinner from '../common/Spinner';
import { formatPercent, formatNumber } from '../../utils/formatters';

const ProtocolFeatures = ({ protocolId }) => {
  const { protocolData, loading, error } = useMarketData();
  const [protocol, setProtocol] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (protocolData?.protocols && protocolId) {
      const selectedProtocol = protocolData.protocols[protocolId.toLowerCase()];
      if (selectedProtocol) {
        setProtocol({
          id: protocolId,
          name: selectedProtocol.name || protocolId.charAt(0).toUpperCase() + protocolId.slice(1),
          ...selectedProtocol
        });
      }
    }
  }, [protocolData, protocolId]);

  if (loading) return <Spinner />;
  if (error) return <div className="text-red-500">Error loading protocol data: {error}</div>;
  if (!protocol) return <div className="text-gray-500">Protocol not found.</div>;

  // Helper function for risk level styling
  const getRiskLevelClass = (level) => {
    if (!level) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    level = level.toLowerCase();
    if (level.includes('low')) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (level.includes('medium')) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    if (level.includes('high')) return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {protocol.image ? (
            <img src={protocol.image} alt={protocol.name} className="h-12 w-12 rounded-full mr-4" />
          ) : (
            <div className="h-12 w-12 rounded-full bg-blue-500 mr-4 flex items-center justify-center text-white font-bold text-xl">
              {protocol.name.charAt(0)}
            </div>
          )}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{protocol.name}</h2>
            <div className="flex space-x-2 mt-1">
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
              {protocol.category && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200">
                  {protocol.category}
                </span>
              )}
            </div>
          </div>
        </div>
        <div className="flex space-x-2">
          {protocol.website && (
            <a 
              href={protocol.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30 dark:hover:bg-blue-900/50"
            >
              Website
            </a>
          )}
          {protocol.contractAddress && (
            <a 
              href={`https://explorer.aptoslabs.com/account/${protocol.contractAddress}?network=mainnet`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium rounded-md text-gray-600 bg-gray-50 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
            >
              View Contract
            </a>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`${
              activeTab === 'overview'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Overview
          </button>
          {(protocol.staking || protocol.lending || protocol.liquidity || protocol.amm) && (
            <button
              onClick={() => setActiveTab('products')}
              className={`${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Products
            </button>
          )}
          <button
            onClick={() => setActiveTab('security')}
            className={`${
              activeTab === 'security'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Security & Risk
          </button>
          <button
            onClick={() => setActiveTab('features')}
            className={`${
              activeTab === 'features'
                ? 'border-blue-500 text-blue-600 dark:text-blue-400 dark:border-blue-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
          >
            Features
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="Protocol Overview">
              <div className="space-y-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {protocol.description || `${protocol.name} is a DeFi protocol on the Aptos blockchain that offers various financial services and products.`}
                </p>
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Key Metrics</h4>
                  <div className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
                      <p className="text-lg font-semibold text-gray-900 dark:text-white">
                        {formatNumber(
                          protocol.staking?.tvl || 
                          protocol.lending?.tvl || 
                          protocol.liquidity?.tvl || 
                          protocol.tvlUSD || 
                          0, 
                          true
                        )}
                      </p>
                    </div>
                    {protocol.staking && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Staking APR</p>
                        <p className="text-lg font-semibold text-blue-600 dark:text-blue-400">
                          {formatPercent(protocol.staking.apr)}
                        </p>
                      </div>
                    )}
                    {protocol.lending && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Lending APR</p>
                        <p className="text-lg font-semibold text-green-600 dark:text-green-400">
                          {formatPercent(protocol.lending.apr)}
                        </p>
                      </div>
                    )}
                    {(protocol.liquidity || protocol.amm) && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Liquidity APR</p>
                        <p className="text-lg font-semibold text-purple-600 dark:text-purple-400">
                          {formatPercent(protocol.liquidity?.apr || protocol.amm?.apr)}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
            
            <Card title="Risk Assessment">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Security Score</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        {protocol.securityScore || 7}/10
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 dark:bg-gray-700">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(protocol.securityScore || 7) * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Risk Level</h4>
                  <div className="mt-2 flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(protocol.riskLevel)}`}>
                      {protocol.riskLevel || 'Medium'}
                    </span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Audits</h4>
                  {protocol.audits ? (
                    <ul className="mt-2 space-y-1">
                      {protocol.audits.map((audit, index) => (
                        <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                          {audit}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                      Audit information not available.
                    </p>
                  )}
                </div>
              </div>
            </Card>
            
            <Card title="Quick Stats">
              <div className="space-y-3">
                {protocol.staking && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Staking Product</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {protocol.staking.product || 'Liquid Staking'}
                    </span>
                  </div>
                )}
                
                {protocol.staking && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Staking APR</span>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                      {formatPercent(protocol.staking.apr)}
                    </span>
                  </div>
                )}
                
                {protocol.lending && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Lending APR</span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      {formatPercent(protocol.lending.apr)}
                    </span>
                  </div>
                )}
                
                {protocol.borrowing && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Borrowing APR</span>
                    <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                      {formatPercent(protocol.borrowing.apr)}
                    </span>
                  </div>
                )}
                
                {(protocol.liquidity || protocol.amm) && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">LP APR</span>
                    <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                      {formatPercent(protocol.liquidity?.apr || protocol.amm?.apr)}
                    </span>
                  </div>
                )}
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Inception Date</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {protocol.inceptionDate || 'N/A'}
                    </span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Governance</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {protocol.governance || 'N/A'}
                  </span>
                </div>
                
                {protocol.tradingFee !== undefined && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500 dark:text-gray-400">Trading Fee</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatPercent(protocol.tradingFee)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">Protocol Links</h4>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {protocol.website && (
                    <a 
                      href={protocol.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Website
                    </a>
                  )}
                  {protocol.twitter && (
                    <a 
                      href={protocol.twitter} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Twitter
                    </a>
                  )}
                  {protocol.documentation && (
                    <a 
                      href={protocol.documentation} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Documentation
                    </a>
                  )}
                  {protocol.contractAddress && (
                    <a 
                      href={`https://explorer.aptoslabs.com/account/${protocol.contractAddress}?network=mainnet`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      Contract
                    </a>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
        
        {activeTab === 'products' && (
          <div className="space-y-6">
            {protocol.staking && (
              <Card title="Staking Products">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {protocol.staking.product || 'Liquid Staking'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {protocol.staking.description || `Stake your APT tokens with ${protocol.name} to earn passive income while maintaining liquidity.`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current APR</p>
                      <p className="text-xl font-semibold text-blue-600 dark:text-blue-400">
                        {formatPercent(protocol.staking.apr)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatNumber(protocol.staking.tvl || 0, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Token</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {protocol.staking.token || 'stAPT'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Lockup Period</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {protocol.staking.lockupPeriod || 'None'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition">
                      Stake APT
                    </button>
                    {protocol.staking.learnMore && (
                      <a 
                        href={protocol.staking.learnMore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}
            
            {protocol.lending && (
              <Card title="Lending Products">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {protocol.lending.product || 'Lending Market'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {protocol.lending.description || `Lend your assets on ${protocol.name} to earn interest while supporting the DeFi ecosystem.`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current APR</p>
                      <p className="text-xl font-semibold text-green-600 dark:text-green-400">
                        {formatPercent(protocol.lending.apr)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatNumber(protocol.lending.tvl || 0, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Supported Assets</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {protocol.lending.supportedAssets || 'APT, USDC, USDT'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Liquidation Factor</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {protocol.lending.liquidationFactor || 'N/A'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700 transition">
                      Lend Assets
                    </button>
                    {protocol.lending.learnMore && (
                      <a 
                        href={protocol.lending.learnMore} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}
            
            {(protocol.liquidity || protocol.amm) && (
              <Card title="Liquidity Products">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {(protocol.liquidity?.product || protocol.amm?.product) || 'Liquidity Pool'}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {(protocol.liquidity?.description || protocol.amm?.description) || `Provide liquidity on ${protocol.name} to earn fees and rewards.`}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500 dark:text-gray-400">Current APR</p>
                      <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">
                        {formatPercent(protocol.liquidity?.apr || protocol.amm?.apr)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">TVL</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatNumber((protocol.liquidity?.tvl || protocol.amm?.tvl) || 0, true)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Top Pools</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {(protocol.liquidity?.topPools || protocol.amm?.topPools) || 'APT-USDC, APT-USDT'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Fee Tier</p>
                      <p className="text-base font-medium text-gray-900 dark:text-white">
                        {formatPercent((protocol.liquidity?.feeTier || protocol.amm?.feeTier) || 0.3)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <button className="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 transition">
                      Add Liquidity
                    </button>
                    {(protocol.liquidity?.learnMore || protocol.amm?.learnMore) && (
                      <a 
                        href={(protocol.liquidity?.learnMore || protocol.amm?.learnMore)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition"
                      >
                        Learn More
                      </a>
                    )}
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
        
        {activeTab === 'security' && (
          <div className="space-y-6">
            <Card title="Security Measures">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Audits</h3>
                    {protocol.audits && protocol.audits.length > 0 ? (
                      <ul className="space-y-2">
                        {protocol.audits.map((audit, index) => (
                          <li key={index} className="flex items-start">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="text-gray-600 dark:text-gray-300">{audit}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">No audit information available.</p>
                    )}
                  </div>
                  
                  <div>
  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Security Features</h3>
  {protocol.securityFeatures && protocol.securityFeatures.length > 0 ? (
    <ul className="space-y-2">
      {protocol.securityFeatures.map((feature, index) => (
        <li key={index} className="flex items-start">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="text-gray-600 dark:text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  ) : (
    <p className="text-gray-600 dark:text-gray-300">Security feature information not available.</p>
  )}
</div>
</div>
</Card>

<Card title="Risk Analysis">
  <div className="space-y-4">
    <div>
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Risk Assessment</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Risk Level</p>
          <div className="flex items-center mt-1">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskLevelClass(protocol.riskLevel)}`}>
              {protocol.riskLevel || 'Medium'}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Security Score</p>
          <p className="text-base font-medium text-gray-900 dark:text-white">
            {protocol.securityScore || 7}/10
          </p>
        </div>
      </div>
    </div>
    
    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Risk Factors</h3>
      <ul className="space-y-2">
        {protocol.riskFactors ? (
          protocol.riskFactors.map((factor, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-500 dark:text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300">{factor}</span>
            </li>
          ))
        ) : (
          <li className="text-gray-600 dark:text-gray-300">
            Risk factor information not available.
          </li>
        )}
      </ul>
    </div>
  </div>
</Card>

<Card title="Mitigation Strategies">
  <div className="space-y-4">
    <p className="text-gray-600 dark:text-gray-300">
      {protocol.riskMitigation || `To mitigate risks when using ${protocol.name}, consider the following strategies.`}
    </p>
    <ul className="space-y-2 mt-4">
      {protocol.mitigationStrategies ? (
        protocol.mitigationStrategies.map((strategy, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{strategy}</span>
          </li>
        ))
      ) : (
        [
          "Diversify your investments across multiple protocols",
          "Start with small amounts to test the protocol",
          "Monitor your positions regularly",
          "Stay updated with protocol announcements",
          "Use hardware wallets for additional security"
        ].map((strategy, index) => (
          <li key={index} className="flex items-start">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 dark:text-green-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-gray-600 dark:text-gray-300">{strategy}</span>
          </li>
        ))
      )}
    </ul>
  </div>
</Card>
</div>
)}

{activeTab === 'features' && (
<div className="space-y-6">
  <Card title="Protocol Features">
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">
        {protocol.featureDescription || `${protocol.name} offers the following key features to enhance your DeFi experience.`}
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        {protocol.features ? (
          protocol.features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  {index + 1}
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))
        ) : (
          [
            {
              title: "Secure Staking",
              description: `${protocol.name} provides a secure environment for staking your assets.`
            },
            {
              title: "Competitive APR",
              description: "Earn competitive returns on your investments."
            },
            {
              title: "Liquidity Management",
              description: "Maintain liquidity while earning rewards."
            },
            {
              title: "User-Friendly Interface",
              description: "Easy-to-use interface for managing your investments."
            }
          ].map((feature, index) => (
            <div key={index} className="flex items-start">
              <div className="flex-shrink-0 mt-1">
                <span className="flex items-center justify-center h-8 w-8 rounded-md bg-blue-500 text-white">
                  {index + 1}
                </span>
              </div>
              <div className="ml-4">
                <h4 className="text-lg font-medium text-gray-900 dark:text-white">{feature.title}</h4>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{feature.description}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  </Card>
  
  <Card title="Unique Advantages">
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">
        {protocol.advantagesDescription || `What makes ${protocol.name} stand out from other protocols on Aptos?`}
      </p>
      
      <ul className="space-y-3 mt-4">
        {protocol.advantages ? (
          protocol.advantages.map((advantage, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300">{advantage}</span>
            </li>
          ))
        ) : (
          [
            `${protocol.name} offers some of the highest APRs in the Aptos ecosystem`,
            "Advanced security measures to protect user funds",
            "Regular protocol upgrades and feature additions",
            "Active community governance and development"
          ].map((advantage, index) => (
            <li key={index} className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-600 dark:text-gray-300">{advantage}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  </Card>
  
  <Card title="Getting Started">
    <div className="space-y-4">
      <p className="text-gray-600 dark:text-gray-300">
        {protocol.gettingStartedDescription || `Follow these steps to get started with ${protocol.name}:`}
      </p>
      
      <ol className="space-y-4 mt-4">
        {protocol.gettingStarted ? (
          protocol.gettingStarted.map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3">
                {index + 1}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{step}</span>
            </li>
          ))
        ) : (
          [
            `Connect your wallet to ${protocol.name}`,
            "Select the assets you want to stake or provide as liquidity",
            "Approve the transaction and confirm in your wallet",
            "Monitor your positions and rewards in the dashboard"
          ].map((step, index) => (
            <li key={index} className="flex items-start">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-500 text-white text-sm font-medium mr-3">
                {index + 1}
              </span>
              <span className="text-gray-600 dark:text-gray-300">{step}</span>
            </li>
          ))
        )}
      </ol>
      
      <div className="mt-6 flex space-x-4">
        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 transition">
          Connect Wallet
        </button>
        {protocol.documentation && (
          <a 
            href={protocol.documentation} 
            target="_blank" 
            rel="noopener noreferrer"
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-800 transition"
          >
            View Documentation
          </a>
        )}
      </div>
    </div>
  </Card>
</div>
)}
</div>
</div>
);
};

export default ProtocolFeatures;