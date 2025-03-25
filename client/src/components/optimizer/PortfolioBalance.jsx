import React, { useState, useEffect, useMemo } from 'react';

/**
 * Component that shows current portfolio balance vs recommended allocation
 * 
 * @param {Object} props
 * @param {Object} props.portfolioData - Current portfolio data
 * @param {Object} props.stakingData - Current staking protocol data
 */
const PortfolioBalance = ({ portfolioData, stakingData }) => {
  const [recommendedAllocation, setRecommendedAllocation] = useState([]);
  const [currentAllocation, setCurrentAllocation] = useState([]);
  const [driftAnalysis, setDriftAnalysis] = useState(null);
  
  // Calculate current allocation from portfolio data
  useEffect(() => {
    if (!portfolioData) return;
    
    const { apt, stAPT, sthAPT, tAPT, dAPT, ammLiquidity, totalValueUSD } = portfolioData;
    
    if (!totalValueUSD || totalValueUSD <= 0) return;
    
    const currentTokens = [];
    
    // Native APT
    if (apt && parseFloat(apt.amount) > 0) {
      currentTokens.push({
        name: 'Native APT',
        protocol: 'native',
        type: 'holding',
        percentage: ((apt.valueUSD / totalValueUSD) * 100).toFixed(2),
        amount: apt.amount,
        valueUSD: apt.valueUSD
      });
    }
    
    // Staked APT - Amnis
    if (stAPT && parseFloat(stAPT.amount) > 0) {
      currentTokens.push({
        name: 'stAPT (Amnis)',
        protocol: 'amnis',
        type: 'staking',
        percentage: ((stAPT.valueUSD / totalValueUSD) * 100).toFixed(2),
        amount: stAPT.amount,
        valueUSD: stAPT.valueUSD
      });
    }
    
    // Staked APT - Thala
    if (sthAPT && parseFloat(sthAPT.amount) > 0) {
      currentTokens.push({
        name: 'sthAPT (Thala)',
        protocol: 'thala',
        type: 'staking',
        percentage: ((sthAPT.valueUSD / totalValueUSD) * 100).toFixed(2),
        amount: sthAPT.amount,
        valueUSD: sthAPT.valueUSD
      });
    }
    
    // Staked APT - Tortuga
    if (tAPT && parseFloat(tAPT.amount) > 0) {
      currentTokens.push({
        name: 'tAPT (Tortuga)',
        protocol: 'tortuga',
        type: 'staking',
        percentage: ((tAPT.valueUSD / totalValueUSD) * 100).toFixed(2),
        amount: tAPT.amount,
        valueUSD: tAPT.valueUSD
      });
    }
    
    // Staked APT - Ditto
    if (dAPT && parseFloat(dAPT.amount) > 0) {
      currentTokens.push({
        name: 'dAPT (Ditto)',
        protocol: 'ditto',
        type: 'staking',
        percentage: ((dAPT.valueUSD / totalValueUSD) * 100).toFixed(2),
        amount: dAPT.amount,
        valueUSD: dAPT.valueUSD
      });
    }
    
    // AMM Liquidity
    if (ammLiquidity && ammLiquidity.hasLiquidity) {
      currentTokens.push({
        name: 'AMM Liquidity',
        protocol: 'liquidity',
        type: 'amm',
        percentage: ((ammLiquidity.estimatedValueUSD / totalValueUSD) * 100).toFixed(2),
        amount: ammLiquidity.estimatedValueUSD / (apt?.valueUSD / parseFloat(apt?.amount)),
        valueUSD: ammLiquidity.estimatedValueUSD
      });
    }
    
    setCurrentAllocation(currentTokens);
  }, [portfolioData]);
  
  // Get recommended allocation from staking data
  useEffect(() => {
    if (!stakingData || !stakingData.strategies) return;
    
    // Default to balanced strategy
    const recommendedStrategy = stakingData.strategies.balanced || 
                              Object.values(stakingData.strategies)[0];
    
    if (!recommendedStrategy || !recommendedStrategy.allocation) return;
    
    // Calculate value for each recommended allocation based on current portfolio value
    const totalValue = portfolioData?.totalValueUSD || 0;
    const aptPrice = portfolioData?.apt?.valueUSD / parseFloat(portfolioData?.apt?.amount || 1);
    
    const recommendedItems = recommendedStrategy.allocation.map(item => {
      const protocolData = stakingData.protocols[item.protocol];
      const productType = item.type || 'staking';
      
      return {
        name: protocolData?.[productType]?.product || 
              `${item.protocol.charAt(0).toUpperCase() + item.protocol.slice(1)} (${productType})`,
        protocol: item.protocol,
        type: productType,
        percentage: item.percentage,
        amount: totalValue > 0 ? ((item.percentage / 100) * (totalValue / aptPrice)).toFixed(2) : 0,
        valueUSD: totalValue > 0 ? ((item.percentage / 100) * totalValue).toFixed(2) : 0
      };
    });
    
    setRecommendedAllocation(recommendedItems);
  }, [stakingData, portfolioData]);
  
  // Calculate drift between current and recommended allocations
  useEffect(() => {
    if (currentAllocation.length === 0 || recommendedAllocation.length === 0) {
      setDriftAnalysis(null);
      return;
    }
    
    const analysis = calculateDrift(currentAllocation, recommendedAllocation);
    setDriftAnalysis(analysis);
  }, [currentAllocation, recommendedAllocation]);
  
  // Helper function to calculate drift
  const calculateDrift = (current, recommended) => {
    const drifts = [];
    let maxDrift = 0;
    let totalDrift = 0;
    
    // Create map of recommended allocations by protocol
    const recommendedMap = recommended.reduce((map, item) => {
      map[item.protocol] = item;
      return map;
    }, {});
    
    // Calculate drift for each current position
    current.forEach(item => {
      const recommendedItem = recommendedMap[item.protocol];
      
      if (recommendedItem) {
        // Protocol exists in both current and recommended
        const currentPct = parseFloat(item.percentage);
        const targetPct = parseFloat(recommendedItem.percentage);
        const drift = Math.abs(currentPct - targetPct);
        
        drifts.push({
          protocol: item.protocol,
          name: item.name,
          current: currentPct,
          target: targetPct,
          drift,
          action: currentPct > targetPct ? 'decrease' : 'increase'
        });
        
        maxDrift = Math.max(maxDrift, drift);
        totalDrift += drift;
        
        // Remove from map to track protocols in recommended but not in current
        delete recommendedMap[item.protocol];
      } else {
        // Current protocol not in recommended - should be fully removed
        drifts.push({
          protocol: item.protocol,
          name: item.name,
          current: parseFloat(item.percentage),
          target: 0,
          drift: parseFloat(item.percentage),
          action: 'remove'
        });
        
        maxDrift = Math.max(maxDrift, parseFloat(item.percentage));
        totalDrift += parseFloat(item.percentage);
      }
    });
    
    // Add protocols that are in recommended but not in current
    for (const [protocol, item] of Object.entries(recommendedMap)) {
      drifts.push({
        protocol,
        name: item.name,
        current: 0,
        target: parseFloat(item.percentage),
        drift: parseFloat(item.percentage),
        action: 'add'
      });
      
      maxDrift = Math.max(maxDrift, parseFloat(item.percentage));
      totalDrift += parseFloat(item.percentage);
    }
    
    // Sort by drift amount (largest first)
    drifts.sort((a, b) => b.drift - a.drift);
    
    const avgDrift = drifts.length > 0 ? totalDrift / drifts.length : 0;
    const DEFAULT_THRESHOLD = 5; // 5% default threshold
    
    return {
      drifts,
      maxDrift,
      avgDrift,
      totalDrift,
      needsRebalance: maxDrift >= DEFAULT_THRESHOLD,
      threshold: DEFAULT_THRESHOLD
    };
  };
  
  // Determine if there's anything to rebalance
  const needsRebalance = useMemo(() => {
    return driftAnalysis?.needsRebalance || false;
  }, [driftAnalysis]);
  
  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6 border border-gray-700">
      <h2 className="text-xl font-bold text-white mb-4">Portfolio Balance Analysis</h2>
      
      {(!portfolioData || !currentAllocation.length) ? (
        <div className="text-center py-6">
          <p className="text-gray-400">Connect your wallet to view portfolio balance</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Current Allocation */}
            <div>
              <h3 className="text-md font-medium text-gray-300 mb-3">Current Allocation</h3>
              <div className="space-y-2">
                {currentAllocation.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getColorForProtocol(item.protocol)}`}></div>
                      <span className="text-white">{item.name}</span>
                    </div>
              
              <div className="mt-2 space-y-2">
                {driftAnalysis.drifts.map((drift, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getColorForProtocol(drift.protocol)}`}></div>
                      <span className="text-white">{drift.name}</span>
                      <span className={`ml-2 text-xs px-1.5 py-0.5 rounded ${
                        drift.action === 'increase' ? 'bg-blue-900/50 text-blue-400' :
                        drift.action === 'decrease' ? 'bg-yellow-900/50 text-yellow-400' :
                        drift.action === 'add' ? 'bg-green-900/50 text-green-400' :
                        'bg-red-900/50 text-red-400'
                      }`}>
                        {drift.action}
                      </span>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center text-white">
                        {drift.current}% 
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mx-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                        </svg>
                        {drift.target}%
                      </div>
                      <div className="text-gray-500 text-xs">Drift: {drift.drift.toFixed(2)}%</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-700 flex justify-between items-center">
                <div>
                  <span className="text-gray-400">Maximum drift:</span>
                  <span className={`ml-2 font-medium ${needsRebalance ? 'text-red-400' : 'text-green-400'}`}>
                    {driftAnalysis.maxDrift.toFixed(2)}%
                  </span>
                </div>
                <div>
                  <span className="text-gray-400">Threshold:</span>
                  <span className="ml-2 font-medium text-white">{driftAnalysis.threshold}%</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

// Helper function to get color for protocol
const getColorForProtocol = (protocol) => {
  const colorMap = {
    native: 'bg-gray-400',
    amnis: 'bg-blue-500',
    thala: 'bg-green-500',
    tortuga: 'bg-purple-500',
    ditto: 'bg-yellow-500',
    liquidity: 'bg-red-500',
    cetus: 'bg-pink-500',
    pancakeswap: 'bg-indigo-500',
    echo: 'bg-cyan-500',
    aries: 'bg-teal-500'
  };
  
  return colorMap[protocol] || 'bg-gray-500';
};

export default PortfolioBalance;      <div className="text-right">
                      <div className="text-white">{item.percentage}%</div>
                      <div className="text-gray-500 text-xs">{item.amount} APT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Recommended Allocation */}
            <div>
              <h3 className="text-md font-medium text-gray-300 mb-3">Recommended Allocation</h3>
              <div className="space-y-2">
                {recommendedAllocation.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${getColorForProtocol(item.protocol)}`}></div>
                      <span className="text-white">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="text-white">{item.percentage}%</div>
                      <div className="text-gray-500 text-xs">{item.amount} APT</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Drift Analysis */}
          {driftAnalysis && (
            <div className="mt-4 border-t border-gray-700 pt-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-md font-medium text-gray-300">Drift Analysis</h3>
                <div className={`px-2 py-1 rounded-md text-xs font-medium ${
                  needsRebalance ? 'bg-red-900/50 text-red-400' : 'bg-green-900/50 text-green-400'
                }`}>
                  {needsRebalance ? 'Rebalance Recommended' : 'Portfolio Balanced'}
                </div>
              </div>