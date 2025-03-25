const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const axios = require('axios');

// Initialize Aptos SDK for Mainnet
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

// Contract addresses for protocols
const contracts = {
  // Liquid Staking Protocols
  amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
  thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
  tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
  ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  
  // Lending/Borrowing Protocols
  aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
  echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
  
  // DEXes and AMMs
  pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
  liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
  cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6",
  
  // Yield Optimizers
  merkle: "0xc0188ad3f42e66b5bd3596e642b8f72749b67d84dafa8348e34014b64175ed5a"
};

// In-memory cache for staking data
let stakingDataCache = null;
let lastFetchTime = 0;
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

/**
 * Get staking data from all protocols
 * @returns {Promise<Object>} Staking data
 */
async function getStakingData() {
  const now = Date.now();
  
  // Return cached data if still valid
  if (stakingDataCache && (now - lastFetchTime) < CACHE_DURATION) {
    return stakingDataCache;
  }
  
  try {
    // Fetch protocol data - in a production environment you'd fetch real data from the blockchain
    // For simplicity, we're using a predefined set here
    const protocols = {
      amnis: {
        staking: { apr: 7.8, product: "stAPT (Liquid Staking)" },
        lending: { apr: 8.3, product: "amAPT (Lending)" },
        amm: { apr: 9.1, product: "amLP (AMM)" },
        blendedStrategy: { apr: 8.2 }
      },
      thala: {
        staking: { apr: 7.5, product: "sthAPT (Liquid Staking)" },
        lending: { apr: 6.8, product: "MOD CDP (Lending)" },
        amm: { apr: 10.4, product: "Thala DEX (AMM)" },
        blendedStrategy: { apr: 8.23 }
      },
      tortuga: {
        staking: { apr: 7.2, product: "tAPT (Liquid Staking)" },
        blendedStrategy: { apr: 7.2 }
      },
      ditto: {
        staking: { apr: 7.1, product: "dAPT (Liquid Staking)" },
        blendedStrategy: { apr: 7.1 }
      },
      aries: {
        lending: { apr: 8.2, product: "arAPT (Lending)" },
        blendedStrategy: { apr: 8.2 }
      },
      echo: {
        lending: { apr: 8.4, product: "ecAPT (Lending)" },
        blendedStrategy: { apr: 8.4 }
      },
      pancakeswap: {
        amm: { apr: 9.5, product: "APT-USDC LP (AMM)" },
        blendedStrategy: { apr: 9.5 }
      },
      liquidswap: {
        amm: { apr: 9.3, product: "APT-USDC LP (AMM)" },
        blendedStrategy: { apr: 9.3 }
      },
      cetus: {
        amm: { apr: 10.5, product: "APT-USDC LP (AMM)" },
        blendedStrategy: { apr: 10.5 }
      },
      merkle: {
        yield: { apr: 11.0, product: "APT Yield Vault" },
        blendedStrategy: { apr: 11.0 }
      }
    };

    // Predefined strategies for different risk profiles
    const strategies = {
      conservative: {
        name: "Conservative",
        description: "Low-risk approach focusing primarily on liquid staking with some lending exposure",
        allocation: [
          { protocol: "amnis", type: "staking", percentage: 70 },
          { protocol: "aries", type: "lending", percentage: 30 }
        ],
        riskLevel: "Low",
        apr: "7.95"
      },
      balanced: {
        name: "Balanced",
        description: "Moderate risk approach balancing staking, lending, and some AMM exposure",
        allocation: [
          { protocol: "thala", type: "staking", percentage: 40 },
          { protocol: "echo", type: "lending", percentage: 30 },
          { protocol: "pancakeswap", type: "amm", percentage: 30 }
        ],
        riskLevel: "Medium",
        apr: "8.73"
      },
      aggressive: {
        name: "Aggressive",
        description: "High-risk approach maximizing yield with focus on AMMs and yield farming",
        allocation: [
          { protocol: "tortuga", type: "staking", percentage: 20 },
          { protocol: "echo", type: "lending", percentage: 20 },
          { protocol: "cetus", type: "amm", percentage: 40 },
          { protocol: "merkle", type: "yield", percentage: 20 }
        ],
        riskLevel: "High",
        apr: "9.54"
      }
    };
    
    const result = {
      protocols,
      strategies,
      lastUpdated: new Date().toISOString()
    };
    
    // Update cache
    stakingDataCache = result;
    lastFetchTime = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching staking data:', error.message);
    
    // Return cached data if available, even if expired
    if (stakingDataCache) {
      return stakingDataCache;
    }
    
    // Return fallback data if no cache available
    return {
      protocols: {
        amnis: {
          staking: { apr: 7.5, product: "stAPT (Liquid Staking)" },
          blendedStrategy: { apr: 7.5 }
        },
        thala: {
          staking: { apr: 7.3, product: "sthAPT (Liquid Staking)" },
          blendedStrategy: { apr: 7.3 }
        }
      },
      strategies: {
        conservative: {
          name: "Conservative",
          description: "Low-risk approach focusing primarily on liquid staking",
          allocation: [
            { protocol: "amnis", type: "staking", percentage: 100 }
          ],
          riskLevel: "Low",
          apr: "7.5"
        },
        balanced: {
          name: "Balanced",
          description: "Moderate risk approach",
          allocation: [
            { protocol: "amnis", type: "staking", percentage: 50 },
            { protocol: "thala", type: "staking", percentage: 50 }
          ],
          riskLevel: "Medium",
          apr: "7.4"
        },
        aggressive: {
          name: "Aggressive",
          description: "High-risk approach",
          allocation: [
            { protocol: "thala", type: "staking", percentage: 100 }
          ],
          riskLevel: "High",
          apr: "7.3"
        }
  },
  lastUpdated: new Date().toISOString()
};
}
}

/**
 * Provide personalized staking recommendations
 * @param {string} walletAddress - User's wallet address
 * @param {Object} portfolioData - User's portfolio data
 * @returns {Promise<Object>} Personalized recommendations
 */
async function getPersonalizedRecommendations(walletAddress, portfolioData) {
  try {
    // Determine risk profile based on portfolio
    let riskProfile = "balanced"; // Default
    
    if (portfolioData) {
      const totalValue = parseFloat(portfolioData.totalValueUSD || 0);
      const aptBalance = parseFloat(portfolioData.apt?.amount || 0);
      const stAPTBalance = parseFloat(portfolioData.stAPT?.amount || 0);
      const sthAPTBalance = parseFloat(portfolioData.sthAPT?.amount || 0);
      const hasAMMExposure = portfolioData.ammLiquidity?.hasLiquidity || false;
      
      if (hasAMMExposure || totalValue > 25000) {
        riskProfile = "aggressive";
      } else if (stAPTBalance > 0 || sthAPTBalance > 0) {
        riskProfile = "balanced";
      } else if (totalValue < 5000) {
        riskProfile = "conservative";
      }
    }
    
    // Get staking strategies
    const stakingData = await getStakingData();
    const recommendedStrategy = stakingData.strategies[riskProfile] || stakingData.strategies.balanced;
    
    // Calculate potential earnings
    const totalValueUSD = parseFloat(portfolioData?.totalValueUSD || 0);
    const apr = parseFloat(recommendedStrategy.apr);
    const yearlyEarnings = totalValueUSD * (apr / 100);
    const monthlyEarnings = yearlyEarnings / 12;
    
    // Format allocation with specific amounts based on user's APT balance
    const aptBalance = parseFloat(portfolioData?.apt?.amount || 0);
    const allocation = recommendedStrategy.allocation.map(item => {
      const protocol = stakingData.protocols[item.protocol];
      const product = protocol[item.type]?.product || `${item.protocol} (${item.type})`;
      const expectedApr = protocol[item.type]?.apr || parseFloat(recommendedStrategy.apr);
      return {
        protocol: item.protocol,
        product,
        percentage: item.percentage,
        amount: (aptBalance * (item.percentage / 100)).toFixed(2),
        expectedApr
      };
    });
    
    return {
      riskProfile,
      recommendedStrategy: {
        name: recommendedStrategy.name,
        description: recommendedStrategy.description,
        riskLevel: recommendedStrategy.riskLevel,
        apr: recommendedStrategy.apr,
        allocation
      },
      potentialEarnings: {
        monthly: monthlyEarnings.toFixed(2),
        yearly: yearlyEarnings.toFixed(2)
      },
      currentHoldings: {
        apt: portfolioData?.apt?.amount || "0",
        stAPT: portfolioData?.stAPT?.amount || "0",
        sthAPT: portfolioData?.sthAPT?.amount || "0",
        hasAmmLiquidity: portfolioData?.ammLiquidity?.hasLiquidity || false
      },
      alternativeStrategies: Object.entries(stakingData.strategies)
        .filter(([key]) => key !== riskProfile)
        .map(([_, strategy]) => ({
          name: strategy.name,
          description: strategy.description,
          riskLevel: strategy.riskLevel,
          apr: strategy.apr
        })),
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating personalized recommendations:', error.message);
    return {
      riskProfile: "balanced",
      recommendedStrategy: {
        name: "Balanced",
        description: "Moderate risk approach balancing staking and lending",
        riskLevel: "Medium",
        apr: "8.0",
        allocation: [
          {
            protocol: "amnis",
            product: "stAPT (Liquid Staking)",
            percentage: 50,
            amount: "0.00",
            expectedApr: 7.5
          },
          {
            protocol: "aries",
            product: "arAPT (Lending)",
            percentage: 50,
            amount: "0.00",
            expectedApr: 8.2
          }
        ]
      },
      potentialEarnings: {
        monthly: "0.00",
        yearly: "0.00"
      },
      currentHoldings: {
        apt: "0.00",
        stAPT: "0.00",
        sthAPT: "0.00",
        hasAmmLiquidity: false
      },
      alternativeStrategies: [
        {
          name: "Conservative",
          description: "Low-risk approach focusing primarily on liquid staking",
          riskLevel: "Low",
          apr: "7.5"
        },
        {
          name: "Aggressive",
          description: "High-risk approach maximizing yield",
          riskLevel: "High",
          apr: "9.5"
        }
      ],
      lastUpdated: new Date().toISOString()
    };
  }
}

module.exports = { getStakingData, getPersonalizedRecommendations, contracts };
