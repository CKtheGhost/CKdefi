import React, { useState } from 'react';

const ProtocolFeatures = ({ protocols }) => {
  const [selectedProtocol, setSelectedProtocol] = useState(protocols?.[0]?.name || '');

  // Features and capabilities for each protocol
  const protocolFeatureMap = {
    amnis: {
      features: [
        { name: 'Liquid Staking', supported: true, details: 'Stake APT while maintaining liquidity' },
        { name: 'Lending', supported: true, details: 'Supply assets to earn interest' },
        { name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' },
        { name: 'Governance', supported: true, details: 'Vote on protocol decisions with Amnis tokens' },
        { name: 'Multi-chain', supported: false, details: 'Currently only on Aptos' }
      ],
      security: {
        audits: ['OtterSec', 'Zellic'],
        lastAudit: 'February 2025',
        insuranceCoverage: true,
        securityScore: 92
      },
      integrations: ['Thala', 'Cetus', 'PancakeSwap'],
      tags: ['Staking', 'DeFi', 'Lending', 'AMM']
    },
    thala: {
      features: [
        { name: 'Liquid Staking', supported: true, details: 'Stake APT while maintaining liquidity' },
        { name: 'Lending', supported: true, details: 'Supply assets to earn interest' },
        { name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' },
        { name: 'Stablecoins', supported: true, details: 'MOD stablecoin issuance' },
        { name: 'Governance', supported: true, details: 'Vote on protocol decisions with THL tokens' }
      ],
      security: {
        audits: ['SlowMist', 'OtterSec'],
        lastAudit: 'January 2025',
        insuranceCoverage: true,
        securityScore: 90
      },
      integrations: ['Amnis', 'Cetus', 'Echo'],
      tags: ['Staking', 'DeFi', 'Stablecoins', 'AMM']
    },
    tortuga: {
      features: [
        { name: 'Liquid Staking', supported: true, details: 'Stake APT while maintaining liquidity' },
        { name: 'Lending', supported: false, details: 'Not currently supported' },
        { name: 'Governance', supported: true, details: 'Vote on protocol decisions with tAPT' },
        { name: 'Yield Optimizer', supported: false, details: 'Planned for Q3 2025' }
      ],
      security: {
        audits: ['HackerOne', 'Zellic'],
        lastAudit: 'December 2024',
        insuranceCoverage: true,
        securityScore: 88
      },
      integrations: ['Amnis', 'Thala', 'PancakeSwap'],
      tags: ['Staking', 'DeFi']
    },
    ditto: {
      features: [
        { name: 'Liquid Staking', supported: true, details: 'Stake APT while maintaining liquidity' },
        { name: 'Lending', supported: false, details: 'Not currently supported' },
        { name: 'Governance', supported: true, details: 'DAO governance structure' }
      ],
      security: {
        audits: ['OtterSec'],
        lastAudit: 'November 2024',
        insuranceCoverage: false,
        securityScore: 85
      },
      integrations: ['Cetus', 'PancakeSwap'],
      tags: ['Staking', 'DeFi']
    },
    aries: {
      features: [
        { name: 'Lending', supported: true, details: 'Supply assets to earn interest' },
        { name: 'Borrowing', supported: true, details: 'Borrow against collateral' },
        { name: 'Flash Loans', supported: true, details: 'Uncollateralized loans within a single transaction' }
      ],
      security: {
        audits: ['SlowMist', 'OtterSec'],
        lastAudit: 'January 2025',
        insuranceCoverage: true,
        securityScore: 89
      },
      integrations: ['Amnis', 'Thala'],
      tags: ['Lending', 'DeFi', 'Borrowing']
    },
    echo: {
      features: [
        { name: 'Lending', supported: true, details: 'Supply assets to earn interest' },
        { name: 'Borrowing', supported: true, details: 'Borrow against collateral' },
        { name: 'Stablecoin', supported: true, details: 'Issue stablecoins against collateral' }
      ],
      security: {
        audits: ['SlowMist'],
        lastAudit: 'October 2024',
        insuranceCoverage: false,
        securityScore: 82
      },
      integrations: ['Thala', 'Cetus'],
      tags: ['Lending', 'DeFi', 'Stablecoins']
    },
    pancakeswap: {
      features: [
        { name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' },
        { name: 'Staking', supported: true, details: 'Stake CAKE to earn rewards' },
        { name: 'Farming', supported: true, details: 'Farm additional tokens by staking LP tokens' },
        { name: 'IFO', supported: true, details: 'Initial Farm Offering for new tokens' },
        { name: 'Lottery', supported: true, details: 'Weekly lottery with CAKE tickets' }
      ],
      security: {
        audits: ['CertiK', 'PeckShield'],
        lastAudit: 'March 2025',
        insuranceCoverage: true,
        securityScore: 94
      },
      integrations: ['Amnis', 'Thala', 'Tortuga'],
      tags: ['AMM', 'DeFi', 'Farming', 'Multi-chain']
    },
    liquidswap: {
      features: [
        { name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' },
        { name: 'Farming', supported: true, details: 'Farm additional tokens by staking LP tokens' },
        { name: 'Concentrated Liquidity', supported: false, details: 'Planned for Q2 2025' }
      ],
      security: {
        audits: ['OtterSec'],
        lastAudit: 'December 2024',
        insuranceCoverage: false,
        securityScore: 84
      },
      integrations: ['Amnis', 'Thala'],
      tags: ['AMM', 'DeFi', 'Farming']
    },
    cetus: {
      features: [
        { name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' },
        { name: 'Concentrated Liquidity', supported: true, details: 'Provide liquidity in specific price ranges' },
        { name: 'Limit Orders', supported: true, details: 'Place limit orders on chain' },
        { name: 'Range Orders', supported: true, details: 'Place range orders for better execution' }
      ],
      security: {
        audits: ['SlowMist', 'CertiK'],
        lastAudit: 'February 2025',
        insuranceCoverage: true,
        securityScore: 92
      },
      integrations: ['Amnis', 'Thala', 'Ditto'],
      tags: ['AMM', 'DeFi', 'Concentrated Liquidity']
    },
    merkle: {
      features: [
        { name: 'Yield Aggregator', supported: true, details: 'Automatically compound yields across protocols' },
        { name: 'Auto-compounding', supported: true, details: 'Compound rewards automatically' },
        { name: 'Multi-strategy', supported: true, details: 'Deploy assets across multiple strategies' }
      ],
      security: {
        audits: ['OtterSec'],
        lastAudit: 'January 2025',
        insuranceCoverage: false,
        securityScore: 86
      },
      integrations: ['Amnis', 'Thala', 'PancakeSwap', 'Aries'],
      tags: ['Yield', 'DeFi', 'Aggregator']
    },
    fetch: {
      features: [
        { name: 'Yield Aggregator', supported: true, details: 'Automatically compound yields across protocols' },
        { name: 'Auto-compounding', supported: true, details: 'Compound rewards automatically' },
        { name: 'Zaps', supported: true, details: 'One-click entry into complex strategies' }
      ],
      security: {
        audits: ['Zellic'],
        lastAudit: 'December 2024',
        insuranceCoverage: false,
        securityScore: 85
      },
      integrations: ['Amnis', 'Thala', 'PancakeSwap'],
      tags: ['Yield', 'DeFi', 'Aggregator']
    }
  };

  // Generate default features for protocols not in the map
  const getDefaultFeatures = (protocol) => {
    let defaultFeatures = {
      features: [
        { name: 'DeFi Protocol', supported: true, details: 'Standard DeFi protocol features' }
      ],
      security: {
        audits: ['Unknown'],
        lastAudit: 'N/A',
        insuranceCoverage: false,
        securityScore: 70
      },
      integrations: [],
      tags: ['DeFi']
    };

    // Add protocol-specific features based on type if available
    if (protocol && typeof protocol === 'object') {
      if (protocol.staking) {
        defaultFeatures.features.push({ name: 'Staking', supported: true, details: 'Stake assets to earn rewards' });
        defaultFeatures.tags.push('Staking');
      }
      if (protocol.lending) {
        defaultFeatures.features.push({ name: 'Lending', supported: true, details: 'Supply assets to earn interest' });
        defaultFeatures.tags.push('Lending');
      }
      if (protocol.amm) {
        defaultFeatures.features.push({ name: 'AMM', supported: true, details: 'Provide liquidity to earn fees' });
        defaultFeatures.tags.push('AMM');
      }
      if (protocol.yield) {
        defaultFeatures.features.push({ name: 'Yield Farming', supported: true, details: 'Earn additional tokens by providing liquidity' });
        defaultFeatures.tags.push('Yield');
      }
    }

    return defaultFeatures;
  };

  // Handle protocol selection
  const handleSelectProtocol = (protocolName) => {
    setSelectedProtocol(protocolName);
  };

  // Find selected protocol
  const getSelectedProtocolObject = () => {
    if (!protocols || protocols.length === 0) return null;
    return protocols.find(p => p.name === selectedProtocol) || protocols[0];
  };

  // Get features for the selected protocol
  const getProtocolFeatures = (protocolName) => {
    const protocolObj = getSelectedProtocolObject();
    return protocolFeatureMap[protocolName] || getDefaultFeatures(protocolObj);
  };

  // Get protocol lowercase name for consistency
  const getProtocolKey = (protocol) => {
    if (!protocol || !protocol.name) return '';
    return protocol.name.toLowerCase();
  };

  const selectedProtocolObj = getSelectedProtocolObject();
  const protocolKey = selectedProtocolObj ? getProtocolKey(selectedProtocolObj) : '';
  const features = getProtocolFeatures(protocolKey);

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-bold mb-4 text-white">Protocol Features & Capabilities</h2>
      
      {/* Protocol selector */}
      <div className="mb-6 overflow-x-auto scrollbar-hide">
        <div className="flex space-x-2">
          {protocols && protocols.map((protocol) => (
            <button
              key={protocol.name}
              onClick={() => handleSelectProtocol(protocol.name)}
              className={`px-3 py-1 rounded-full text-sm whitespace-nowrap ${
                selectedProtocol === protocol.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              {protocol.name}
            </button>
          ))}
        </div>
      </div>

      {selectedProtocolObj && (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Features */}
            <div className="bg-gray-700 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-3 text-white">Features</h3>
              <ul className="space-y-2">
                {features.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <div className={`mt-1 h-4 w-4 rounded-full ${feature.supported ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                    <div className="ml-3">
                      <p className="text-white font-medium">{feature.name}</p>
                      <p className="text-gray-400 text-sm">{feature.details}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Security & Integrations */}
            <div className="space-y-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Security</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Audits:</span>
                    <span className="text-white">{features.security.audits.join(', ')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Audit:</span>
                    <span className="text-white">{features.security.lastAudit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Insurance:</span>
                    <span className={features.security.insuranceCoverage ? 'text-green-500' : 'text-gray-400'}>
                      {features.security.insuranceCoverage ? 'Covered' : 'Not Covered'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Security Score:</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-600 rounded-full mr-2">
                        <div 
                          className={`h-full rounded-full ${
                            features.security.securityScore >= 90 ? 'bg-green-500' : 
                            features.security.securityScore >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${features.security.securityScore}%` }}
                        />
                      </div>
                      <span className="text-white">{features.security.securityScore}/100</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold mb-3 text-white">Integrations</h3>
                <div className="flex flex-wrap gap-2">
                  {features.integrations.length > 0 ? (
                    features.integrations.map((integration, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-600 rounded-full text-sm text-gray-300">
                        {integration}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-400">No known integrations</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2 text-white">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {features.tags.map((tag, index) => (
                <span key={index} className="px-3 py-1 bg-blue-500/30 text-blue-300 rounded-full text-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Protocol Information */}
          {selectedProtocolObj.blendedStrategy && (
            <div className="mt-6 pt-4 border-t border-gray-700">
              <div className="flex justify-between">
                <span className="text-gray-400">Blended APR:</span>
                <span className="text-blue-400 font-semibold">{selectedProtocolObj.blendedStrategy.apr}%</span>
              </div>
              {/* Additional protocol data if available */}
              {selectedProtocolObj.staking && (
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Staking APR:</span>
                  <span className="text-white">{selectedProtocolObj.staking.apr}%</span>
                </div>
              )}
              {selectedProtocolObj.lending && (
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">Lending APR:</span>
                  <span className="text-white">{selectedProtocolObj.lending.apr}%</span>
                </div>
              )}
              {selectedProtocolObj.amm && (
                <div className="flex justify-between mt-2">
                  <span className="text-gray-400">AMM APR:</span>
                  <span className="text-white">{selectedProtocolObj.amm.apr}%</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!selectedProtocolObj && (
        <div className="bg-gray-700 rounded-lg p-6 text-center">
          <p className="text-gray-400">Select a protocol to view its features</p>
        </div>
      )}
    </div>
  );
};

export default ProtocolFeatures;