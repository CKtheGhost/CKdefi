// contracts.js - Contract addresses for Aptos DeFi protocols
module.exports = {
  // Contract addresses for various Aptos protocols
  
  // Liquid Staking Protocols
  STAKING_CONTRACTS: {
    amnis: "0x111ae3e5bc816a5e63c2da97d0aa3886519e0cd5e4b046659fa35796bd11542a",
    thala: "0xfaf4e633ae9eb31366c9ca24214231760926576c7b625313b3688b5e900731f6",
    tortuga: "0x952c1b1fc8eb75ee80f432c9d0a84fcda1d5c7481501a7eca9199f1596a60b53",
    ditto: "0xd11107bdf0d6d7040c6c0bfbdecb6545191fdf13e8d8d259952f53e1713f61b5",
  },
  
  // Lending/Borrowing Protocols
  LENDING_CONTRACTS: {
    aries: "0x9770fa9c725cbd97eb50b2be5f7416efdfd1f1554beb0750d4dae4c64e860da3",
    echelon: "0xf8197c9fa1a397568a47b7a6c5a9b09fa97c8f29f9dcc347232c22e3b24b1f09",
    echo: "0xeab7ea4d635b6b6add79d5045c4a45d8148d88287b1cfa1c3b6a4b56f46839ed",
    joule: "0x1ef1320ef4b26367611d6ffa8abd34b04bd479abfa12590af1eac71fdd8731b3",
    abel: "0x7e783b399436bb5c7e520cefd40d797720cbd117af918fee6f5f2ca50c3a284e",
  },
  
  // DEXes and AMMs
  DEX_CONTRACTS: {
    pancakeswap: "0xc7efb4076dbe143cbcd98cfaaa929ecfc8f299203dfff63b95ccb6bfe19850fa",
    liquidswap: "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12",
    cetus: "0x27156bd56eb5637b9adde4d915b596f92d2f28f0ade2eaef48fa73e360e4e8a6",
    sushi: "0x52cd2babe81b8aa7e5b4958c6bb294b1aaaeec23f711fb71e9aad5bf3f67eab9",
    aux: "0xbd35135844473187163ca197ca93b2ab014370587bb0ed3befff9e902d6bb541",
  },
  
  // Yield Optimizers
  YIELD_CONTRACTS: {
    merkle: "0xc0188ad3f42e66b5bd3596e642b8f72749b67d84dafa8348e34014b64175ed5a",
    fetch: "0x5ae6789dd2fec1a9ec9cccf1a4fecd46af7c5645cdefee965ac7263035724c77",
  },
  
  // Stablecoin and Minting Protocols
  STABLECOIN_CONTRACTS: {
    thala_stablecoin: "0x7fd500c11216f0fe3095e6c5d88a696c3e585a77d28c37def5b0afc380c3293f",
    momento: "0xecf044bc5344e3d40e10fca8250a5e927f5a7a8f4abe3a52adf8f215eb9cff9a",
  },
  
  // Other DeFi
  OTHER_CONTRACTS: {
    pontem: "0x8b7311d78d47e37d09435b8dc37c14afd977c5cbc3c4b6506e6e9d0e2d1c7bdb",
    apt_farm: "0xc84e28b9ed4ca8f7faa28a74b958a8cb7c5d6c1a78edb2d8d74562f7fa7ef8fe",
  },
  
  // Function name patterns by protocol and operation
  FUNCTION_MAPPINGS: {
    amnis: { 
      stake: '::staking::stake', 
      unstake: '::staking::unstake', 
      lend: '::lending::supply', 
      withdraw: '::lending::withdraw', 
      addLiquidity: '::router::add_liquidity', 
      removeLiquidity: '::router::remove_liquidity',
      swap: '::router::swap_exact_input'
    },
    thala: { 
      stake: '::staking::stake_apt', 
      unstake: '::staking::unstake_apt', 
      lend: '::lending::supply_apt', 
      withdraw: '::lending::withdraw_apt', 
      addLiquidity: '::router::add_liquidity', 
      removeLiquidity: '::router::remove_liquidity',
      swap: '::router::swap_exact_input'
    },
    tortuga: { 
      stake: '::staking::stake_apt', 
      unstake: '::staking::unstake_apt' 
    },
    echo: { 
      lend: '::lending::supply',
      withdraw: '::lending::withdraw' 
    },
    ditto: { 
      stake: '::staking::stake', 
      unstake: '::staking::unstake' 
    },
    aries: { 
      lend: '::lending::supply', 
      withdraw: '::lending::withdraw' 
    },
    echelon: { 
      lend: '::lending::deposit', 
      withdraw: '::lending::withdraw' 
    },
    joule: { 
      lend: '::lending::deposit', 
      withdraw: '::lending::withdraw' 
    },
    abel: { 
      lend: '::lending::deposit', 
      withdraw: '::lending::withdraw' 
    },
    cetus: { 
      addLiquidity: '::pool::add_liquidity', 
      removeLiquidity: '::pool::remove_liquidity',
      swap: '::pool::swap'
    },
    pancakeswap: { 
      addLiquidity: '::router::add_liquidity', 
      removeLiquidity: '::router::remove_liquidity',
      swap: '::router::swap_exact_input'
    },
    liquidswap: { 
      addLiquidity: '::router::add_liquidity', 
      removeLiquidity: '::router::remove_liquidity',
      swap: '::router::swap_exact_input'
    },
    sushi: { 
      addLiquidity: '::router::add_liquidity', 
      removeLiquidity: '::router::remove_liquidity',
      swap: '::router::swap_exact_input'
    },
    aux: { 
      addLiquidity: '::amm::add_liquidity', 
      removeLiquidity: '::amm::remove_liquidity',
      swap: '::amm::swap'
    },
    merkle: { 
      deposit: '::yield::deposit',
      withdraw: '::yield::withdraw'
    },
    fetch: { 
      deposit: '::farming::deposit',
      withdraw: '::farming::withdraw'
    },
    thala_stablecoin: { 
      deposit: '::vault::deposit',
      withdraw: '::vault::withdraw'
    },
    momento: { 
      deposit: '::vault::mint',
      withdraw: '::vault::burn'
    },
    pontem: {
      addLiquidity: '::dex::add_liquidity',
      removeLiquidity: '::dex::remove_liquidity',
      swap: '::dex::swap'
    },
    apt_farm: {
      deposit: '::farm::stake',
      withdraw: '::farm::unstake'
    }
  },
  
  // Default function names by operation type (fallback)
  DEFAULT_FUNCTIONS: {
    stake: '::staking::stake',
    unstake: '::staking::unstake',
    lend: '::lending::supply',
    withdraw: '::lending::withdraw',
    addLiquidity: '::router::add_liquidity',
    removeLiquidity: '::router::remove_liquidity',
    deposit: '::yield::deposit',
    swap: '::router::swap_exact_input'
  },
  
  // Helper method to get all contract addresses
  getAllAddresses() {
    return {
      ...this.STAKING_CONTRACTS,
      ...this.LENDING_CONTRACTS,
      ...this.DEX_CONTRACTS,
      ...this.YIELD_CONTRACTS,
      ...this.STABLECOIN_CONTRACTS,
      ...this.OTHER_CONTRACTS
    };
  },
  
  // Helper method to get contract by protocol name
  getContract(protocol) {
    const lowerProtocol = protocol.toLowerCase();
    const allContracts = this.getAllAddresses();
    return allContracts[lowerProtocol] || null;
  },
  
  // Helper method to get function name for a protocol and operation
  getFunctionName(protocol, operation) {
    const lowerProtocol = protocol.toLowerCase();
    const lowerOperation = operation.toLowerCase();
    
    // Check for specific protocol-operation mapping
    if (this.FUNCTION_MAPPINGS[lowerProtocol]?.[lowerOperation]) {
      return this.FUNCTION_MAPPINGS[lowerProtocol][lowerOperation];
    }
    
    // Fallback to default function by operation
    return this.DEFAULT_FUNCTIONS[lowerOperation] || `::${lowerOperation}::execute`;
  }
};