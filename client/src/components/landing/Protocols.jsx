import React, { useState } from 'react';
import Card from '../common/Card';

/**
 * Protocols section component for the landing page
 */
const Protocols = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  
  // Define protocol categories
  const categories = [
    { id: 'all', name: 'All Protocols' },
    { id: 'liquid-staking', name: 'Liquid Staking' },
    { id: 'lending', name: 'Lending & Borrowing' },
    { id: 'dex', name: 'DEXes & AMMs' },
    { id: 'yield', name: 'Yield Optimizers' },
    { id: 'stablecoin', name: 'Stablecoins' }
  ];
  
  // Define protocols with their data
  const allProtocols = [
    // Liquid Staking Protocols
    {
      id: 'amnis',
      name: 'Amnis',
      category: 'liquid-staking',
      logo: '/protocols/amnis.png',
      website: 'https://amnis.finance',
      tvl: '$84.5M',
      apr: '7.8%',
      description: 'Liquid staking provider on Aptos offering stAPT tokens',
    },
    {
      id: 'thala',
      name: 'Thala',
      category: 'liquid-staking',
      logo: '/protocols/thala.png',
      website: 'https://thala.fi',
      tvl: '$78.2M',
      apr: '7.5%',
      description: 'Staking and DeFi infrastructure with sthAPT tokens',
    },
    {
      id: 'tortuga',
      name: 'Tortuga',
      category: 'liquid-staking',
      logo: '/protocols/tortuga.png',
      website: 'https://tortuga.finance',
      tvl: '$45.1M',
      apr: '7.2%',
      description: 'Liquid staking solution with tAPT tokens',
    },
    {
      id: 'ditto',
      name: 'Ditto',
      category: 'liquid-staking',
      logo: '/protocols/ditto.png',
      website: 'https://ditto.money',
      tvl: '$32.6M',
      apr: '7.1%',
      description: 'Decentralized staking with dAPT tokens',
    },
    
    // Lending Protocols
    {
      id: 'aries',
      name: 'Aries',
      category: 'lending',
      logo: '/protocols/aries.png',
      website: 'https://ariesmarkets.xyz',
      tvl: '$41.2M',
      apr: '8.2%',
      description: 'Money markets protocol for lending and borrowing',
    },
    {
      id: 'echelon',
      name: 'Echelon',
      category: 'lending',
      logo: '/protocols/echelon.png',
      website: 'https://echelon.fi',
      tvl: '$38.7M',
      apr: '8.5%',
      description: 'Advanced lending platform with dynamic interest rates',
    },
    {
      id: 'echo',
      name: 'Echo',
      category: 'lending',
      logo: '/protocols/echo.png',
      website: 'https://echo.finance',
      tvl: '$29.4M',
      apr: '8.3%',
      description: 'Isolated lending markets with enhanced risk management',
    },
    {
      id: 'joule',
      name: 'Joule',
      category: 'lending',
      logo: '/protocols/joule.png',
      website: 'https://joule.finance',
      tvl: '$24.8M',
      apr: '7.9%',
      description: 'Electricity-themed lending platform with adjustable LTVs',
    },
    
    // DEXes and AMMs
    {
      id: 'pancakeswap',
      name: 'PancakeSwap',
      category: 'dex',
      logo: '/protocols/pancakeswap.png',
      website: 'https://pancakeswap.finance',
      tvl: '$68.3M',
      apr: '9.5%',
      description: 'Leading DEX with farming and staking options',
    },
    {
      id: 'liquidswap',
      name: 'LiquidSwap',
      category: 'dex',
      logo: '/protocols/liquidswap.png',
      website: 'https://liquidswap.com',
      tvl: '$52.6M',
      apr: '8.9%',
      description: 'Concentrated liquidity AMM with flexible trading options',
    },
    {
      id: 'cetus',
      name: 'Cetus',
      category: 'dex',
      logo: '/protocols/cetus.png',
      website: 'https://cetus.zone',
      tvl: '$48.7M',
      apr: '10.2%',
      description: 'Multi-chain DEX with advanced order types',
    },
    
    // Yield Optimizers
    {
      id: 'merkle',
      name: 'Merkle',
      category: 'yield',
      logo: '/protocols/merkle.png',
      website: 'https://merkle.finance',
      tvl: '$28.4M',
      apr: '10.0%',
      description: 'Auto-compounding yield optimizer with strategy vaults',
    },
    {
      id: 'fetch',
      name: 'Fetch',
      category: 'yield',
      logo: '/protocols/fetch.png',
      website: 'https://fetch.finance',
      tvl: '$22.9M',
      apr: '11.2%',
      description: 'Yield aggregator with cross-protocol optimization',
    },
    
    // Stablecoins
    {
      id: 'thala-stablecoin',
      name: 'Thala MOD',
      category: 'stablecoin',
      logo: '/protocols/thala-mod.png',
      website: 'https://thala.fi/mod',
      tvl: '$35.6M',
      apr: '6.0%',
      description: 'Over-collateralized stablecoin with multi-asset backing',
    },
    {
      id: 'momento',
      name: 'Momento',
      category: 'stablecoin',
      logo: '/protocols/momento.png',
      website: 'https://momento.finance',
      tvl: '$24.1M',
      apr: '6.2%',
      description: 'Decentralized stablecoin with algorithmic stability',
    }
  ];
  
  // Filter protocols based on active category
  const filteredProtocols = activeCategory === 'all' 
    ? allProtocols 
    : allProtocols.filter(protocol => protocol.category === activeCategory);
  
  // Function to handle logo loading errors
  const handleLogoError = (e) => {
    e.target.onerror = null;
    e.target.src = '/icons/default-protocol.svg';
  };

  return (
    <section id="protocols" className="py-20 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Supported Protocols</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            CompounDefi integrates with all major DeFi protocols on the Aptos blockchain, 
            providing a seamless experience for yield optimization.
          </p>
        </div>
        
        {/* Category tabs */}
        <div className="flex flex-wrap justify-center mb-12 gap-2">
          {categories.map(category => (
            <button
              key={category.id}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
        
        {/* Protocols grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProtocols.map(protocol => (
            <Card key={protocol.id} className="border-gray-700 hover:border-blue-500/50 transition-colors">
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden mr-3">
                    <img 
                      src={protocol.logo} 
                      alt={protocol.name} 
                      className="w-8 h-8 object-contain"
                      onError={handleLogoError}
                    />
                  </div>
                  <div>
                    <h3 className="font-bold">{protocol.name}</h3>
                    <a 
                      href={protocol.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-blue-400 hover:text-blue-300"
                    >
                      {protocol.website.replace('https://', '')}
                    </a>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400 mb-4 flex-grow">
                  {protocol.description}
                </p>
                
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-gray-750 rounded p-2">
                    <span className="text-gray-400">TVL</span>
                    <div className="font-semibold">{protocol.tvl}</div>
                  </div>
                  <div className="bg-gray-750 rounded p-2">
                    <span className="text-gray-400">APR</span>
                    <div className="font-semibold text-green-400">{protocol.apr}</div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
        
        {/* View all protocols button */}
        <div className="text-center mt-12">
          <a 
            href="/protocols"
            className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
          >
            View All Protocols
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default Protocols;