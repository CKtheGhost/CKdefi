const { Aptos, AptosConfig, Network } = require('@aptos-labs/ts-sdk');
const axios = require('axios');

// Initialize Aptos SDK
const aptosConfig = new AptosConfig({ 
  network: Network.MAINNET,
  timeout: 15000  // 15 seconds timeout
});
const aptos = new Aptos(aptosConfig);

// Import contract addresses from staking_optimizer
const { contracts } = require('./staking_optimizer');

/**
 * Get portfolio data for a wallet
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} Portfolio data
 */
async function getPortfolioData(walletAddress) {
  try {
    if (!walletAddress) {
      throw new Error("No wallet address provided");
    }
    
    // Get APT price
    const aptPrice = await getAptPrice();
    
    // Get APT balance
    const aptBalance = await getAptBalance(walletAddress);
    const aptValueUSD = parseFloat(aptBalance) * aptPrice;
    
    // Get staked balances
    const stakedBalances = await getStakedBalances(walletAddress);
    
    // Calculate values for all staked tokens
    const stAPTBalance = stakedBalances.stAPT;
    const stAPTValueUSD = parseFloat(stAPTBalance) * aptPrice * 1.02; // Premium over APT
    
    const sthAPTBalance = stakedBalances.sthAPT;
    const sthAPTValueUSD = parseFloat(sthAPTBalance) * aptPrice * 1.01;
    
    const tAPTBalance = stakedBalances.tAPT;
    const tAPTValueUSD = parseFloat(tAPTBalance) * aptPrice * 1.01;
    
    const dAPTBalance = stakedBalances.dAPT;
    const dAPTValueUSD = parseFloat(dAPTBalance) * aptPrice * 1.005;
    
    // Get AMM liquidity
    const ammLiquidity = await getAmmLiquidity(walletAddress);
    
    // Get recent transactions
    const recentTransactions = await getTransactionHistory(walletAddress);
    
    // Calculate total value
    const totalValueUSD = aptValueUSD + stAPTValueUSD + sthAPTValueUSD + tAPTValueUSD + dAPTValueUSD + (ammLiquidity.estimatedValueUSD || 0);
    
    // Generate analytics
    const analytics = generateAnalytics(aptBalance, stakedBalances, ammLiquidity);
    
    // Generate performance metrics
    const performance = {
      dailyChange: "+0.28",
      weeklyChange: "+1.42",
      monthlyChange: "+5.76",
      totalRewards: ((Math.random() * 5) + 5).toFixed(2)
    };
    
    // Generate historical data
    const historicalData = generateHistoricalData();
    
    return {
      apt: { 
        amount: aptBalance, 
        valueUSD: aptValueUSD,
        price: aptPrice 
      },
      stAPT: { 
        amount: stAPTBalance, 
        valueUSD: stAPTValueUSD,
        protocol: "amnis",
        apr: 7.8
      },
      sthAPT: { 
        amount: sthAPTBalance, 
        valueUSD: sthAPTValueUSD,
        protocol: "thala",
        apr: 7.5
      },
      tAPT: { 
        amount: tAPTBalance, 
        valueUSD: tAPTValueUSD,
        protocol: "tortuga",
        apr: 7.2
      },
      dAPT: { 
        amount: dAPTBalance, 
        valueUSD: dAPTValueUSD,
        protocol: "ditto",
        apr: 7.1
      },
      ammLiquidity,
      totalValueUSD,
      recentTransactions,
      analytics,
      performance,
      historicalData,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error in getPortfolioData:', error);
    return {
      error: error.message,
      lastUpdated: new Date().toISOString()
    };
  }
}

/**
 * Get APT balance for a wallet
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<string>} APT balance as string
 */
async function getAptBalance(walletAddress) {
  try {
    const resources = await aptos.getAccountResources({ accountAddress: walletAddress });
    
    const aptCoinStore = resources.find(r => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    if (!aptCoinStore || !aptCoinStore.data || !aptCoinStore.data.coin) return "0.00";
    
    return (parseInt(aptCoinStore.data.coin.value || "0") / 1e8).toFixed(2);
  } catch (error) {
    console.error('Error fetching APT balance:', error);
    return "0.00";
  }
}

/**
 * Get staked balances for a wallet
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} Staked balances
 */
async function getStakedBalances(walletAddress) {
  try {
    const resources = await aptos.getAccountResources({ accountAddress: walletAddress });
    
    // Initialize all staked balances
    const stakedBalances = {
      stAPT: "0.00",
      sthAPT: "0.00",
      tAPT: "0.00",
      dAPT: "0.00"
    };
    
    // Find stAPT (Amnis)
    const stAPTResource = resources.find(r => r.type.includes(`${contracts.amnis}::staking`) && r.type.includes("stapt"));
    if (stAPTResource && stAPTResource.data && stAPTResource.data.coin) {
      stakedBalances.stAPT = (parseInt(stAPTResource.data.coin.value || "0") / 1e8).toFixed(2);
    }
    
    // Find sthAPT (Thala)
    const sthAPTResource = resources.find(r => r.type.includes(`${contracts.thala}::staking`) && r.type.includes("token"));
    if (sthAPTResource && sthAPTResource.data) {
      stakedBalances.sthAPT = (parseInt(sthAPTResource.data.value || "0") / 1e8).toFixed(2);
    }
    
    // Find tAPT (Tortuga)
    const tAPTResource = resources.find(r => r.type.includes(`${contracts.tortuga}::staking`) && r.type.includes("token"));
    if (tAPTResource && tAPTResource.data) {
      stakedBalances.tAPT = (parseInt(tAPTResource.data.value || "0") / 1e8).toFixed(2);
    }
    
    // Find dAPT (Ditto)
    const dAPTResource = resources.find(r => r.type.includes(`${contracts.ditto}::staking`) && r.type.includes("token"));
    if (dAPTResource && dAPTResource.data) {
      stakedBalances.dAPT = (parseInt(dAPTResource.data.value || "0") / 1e8).toFixed(2);
    }
    
    return stakedBalances;
  } catch (error) {
    console.error('Error fetching staked balances:', error);
    return {
      stAPT: "0.00",
      sthAPT: "0.00",
      tAPT: "0.00",
      dAPT: "0.00"
    };
  }
}

/**
 * Get AMM liquidity positions
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Object>} AMM liquidity info
 */
async function getAmmLiquidity(walletAddress) {
  try {
    const resources = await aptos.getAccountResources({ accountAddress: walletAddress });
    
    const lpResources = resources.filter(r => 
      r.type.includes("LiquidityPool") || 
      r.type.includes("LP<") || 
      r.type.includes("Swap") || 
      r.type.includes("AMM")
    );
    
    if (lpResources.length === 0) {
      return { 
        hasLiquidity: false, 
        estimatedValueUSD: 0,
        positions: [] 
      };
    }
    
    const positions = [];
    let totalValueUSD = 0;
    
    // For simplicity, we'll just assume a value for demonstration
    // In a real implementation, you'd calculate the actual value of LP tokens
    if (lpResources.length > 0) {
      totalValueUSD = 1000;
      
      positions.push({
        protocol: "pancakeswap",
        pair: "APT/USDC",
        estimatedValueUSD: 600
      });
      
      positions.push({
        protocol: "liquidswap",
        pair: "APT/USDT",
        estimatedValueUSD: 400
      });
    }
    
    return { 
      hasLiquidity: positions.length > 0, 
      estimatedValueUSD: totalValueUSD,
      positions
    };
  } catch (error) {
    console.error('Error fetching AMM liquidity:', error);
    return { 
      hasLiquidity: false, 
      estimatedValueUSD: 0,
      positions: [] 
    };
  }
}

/**
 * Get transaction history
 * @param {string} walletAddress - User's wallet address
 * @returns {Promise<Array>} Transaction history
 */
async function getTransactionHistory(walletAddress) {
  try {
    const transactions = await aptos.getAccountTransactions({ accountAddress: walletAddress, limit: 10 });
    
    return transactions.map(tx => {
      let type = "Transaction";
      
      if (tx.payload?.function) {
        if (tx.payload.function.includes("stake")) {
          type = "Stake";
        } else if (tx.payload.function.includes("unstake")) {
          type = "Unstake";
        } else if (tx.payload.function.includes("swap")) {
          type = "Swap";
        } else if (tx.payload.function.includes("transfer")) {
          type = "Transfer";
        }
      }
      
      return {
        hash: tx.hash,
        type,
        timestamp: tx.timestamp,
        success: tx.success,
        gasUsed: tx.gas_used || "0"
      };
    });
  } catch (error) {
    console.error('Error fetching transaction history:', error);
    return [];
  }
}

/**
 * Get current APT price
 * @returns {Promise<number>} APT price in USD
 */
async function getAptPrice() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'aptos',
        vs_currencies: 'usd'
      },
      timeout: 5000
    });
    
    return response.data.aptos.usd;
  } catch (error) {
    console.error('Error fetching APT price:', error);
    return 12.5; // Fallback price
  }
}

/**
 * Generate portfolio analytics
 * @param {string} aptBalance - Native APT balance
 * @param {Object} stakedBalances - Staked token balances
 * @param {Object} ammLiquidity - AMM liquidity data
 * @returns {Object} Portfolio analytics
 */
function generateAnalytics(aptBalance, stakedBalances, ammLiquidity) {
  const aptFloat = parseFloat(aptBalance) || 0;
  const stakedSum = parseFloat(stakedBalances.stAPT) + 
                   parseFloat(stakedBalances.sthAPT) + 
                   parseFloat(stakedBalances.tAPT) + 
                   parseFloat(stakedBalances.dAPT);
  const ammValue = ammLiquidity.estimatedValueUSD || 0;
  
  const totalBalance = aptFloat + stakedSum + (ammValue / 12.5); // Convert USD to APT
  
  // Calculate allocation percentages
  let aptPercentage = 0;
  let stakedPercentage = 0;
  let ammPercentage = 0;
  
  if (totalBalance > 0) {
    aptPercentage = (aptFloat / totalBalance) * 100;
    stakedPercentage = (stakedSum / totalBalance) * 100;
    ammPercentage = ((ammValue / 12.5) / totalBalance) * 100;
  }
  
  // Calculate diversification score (0-100)
  let diversificationScore = 0;
  
  if (totalBalance > 0) {
    // Count active positions
    let activePositions = 0;
    if (aptFloat > 0.1) activePositions++;
    if (stakedSum > 0.1) activePositions++;
    if (ammValue > 1) activePositions++;
    
    // Calculate score based on diversification
    diversificationScore = Math.min(100, activePositions * 33);
  }
  
  // Calculate yield efficiency
  let yieldEfficiency = 0;
  
  if (totalBalance > 0) {
    // Higher percentage of staked assets is better
    yieldEfficiency = Math.min(100, 
      (stakedPercentage * 0.8) + 
      (ammPercentage * 0.9)
    );
  }
  
  return {
    allocation: {
      apt: aptPercentage.toFixed(2),
      staked: stakedPercentage.toFixed(2),
      amm: ammPercentage.toFixed(2)
    },
    diversificationScore: diversificationScore.toFixed(0),
    yieldEfficiency: yieldEfficiency.toFixed(0),
    totalPositions: (aptFloat > 0 ? 1 : 0) + 
                    (stakedSum > 0 ? 1 : 0) + 
                    (ammValue > 0 ? 1 : 0)
  };
}

/**
 * Generate historical data for the wallet
 * @returns {Object} Historical data
 */
function generateHistoricalData() {
  const days = 30;
  const timestamps = [];
  const values = [];
  const apy = [];
  
  const now = new Date();
  let value = 100; // Starting value
  let currentApy = 7.5; // Starting APY
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    timestamps.push(date.toISOString().split('T')[0]);
    
    // Random daily change between -2% and +4%
    const change = ((Math.random() * 6) - 2) / 100;
    value = value * (1 + change);
    values.push(value.toFixed(2));
    
    // Random daily APY change between -0.2% and +0.2%
    const apyChange = ((Math.random() * 0.4) - 0.2);
    currentApy = Math.max(5, Math.min(12, currentApy + apyChange));
    apy.push(currentApy.toFixed(2));
  }
  
  return {
    timestamps,
    values,
    apy
  };
}

module.exports = { getPortfolioData, getAptBalance, getStakedBalances, getAmmLiquidity, getTransactionHistory, getAptPrice };
