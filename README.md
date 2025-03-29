# CompounDefi - AI-Powered DeFi Aggregator for Aptos

CompounDefi is a comprehensive DeFi aggregator and yield optimizer for the Aptos blockchain. It leverages AI to analyze market conditions, provide personalized investment strategies, and enable one-click execution of complex DeFi operations across multiple protocols.

## Features

- **DeFi Protocol Aggregation**: Access all major Aptos DeFi protocols in a single interface
- **AI-Powered Analysis**: Get intelligent insights into market conditions and protocol performance
- **Personalized Investment Strategies**: Receive customized recommendations based on your risk profile
- **One-Click Execution**: Execute complex strategies with a single transaction approval
- **Auto-Rebalancer**: Automatically maintain optimal portfolio allocation as market conditions change
- **Social Media Integration**: Connect Twitter, Discord, and Telegram to receive alerts and updates
- **Real-Time Portfolio Analytics**: Track performance metrics and yield opportunities

## Supported Protocols

CompounDefi integrates with the following Aptos protocols:

### Liquid Staking
- Amnis Finance (stAPT)
- Thala Labs (sthAPT)
- Tortuga Finance (tAPT)
- Ditto Money (dAPT)

### Lending & Borrowing
- Aries Markets
- Echelon
- Echo Finance
- Joule Finance

### DEXs & AMMs
- PancakeSwap
- LiquidSwap
- Cetus

### Yield Optimizers
- Merkle Finance
- Fetch Finance

### Stablecoins
- Thala MOD
- Momento

## Getting Started

### Prerequisites
- Node.js v16+ and npm/yarn
- An Aptos-compatible wallet (e.g., Petra, Martian, Rise)
- Basic knowledge of DeFi concepts

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/compoundefi.git
cd compoundefi
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Configure environment:
Create a `.env` file based on `.env.example` with your API keys and configuration.

4. Start the development server:
```bash
npm start
# or
yarn start
```

5. Build for production:
```bash
npm run build
# or
yarn build
```

## Usage

### 1. Connect Your Wallet
- Visit the landing page and click "Connect Wallet"
- Select your Aptos wallet provider (Petra, Martian, Rise, etc.)
- Approve the connection request in your wallet

### 2. Complete Onboarding
- Set your risk profile (Conservative, Balanced, Aggressive)
- Connect social accounts (optional)
- Configure notification preferences

### 3. Dashboard Navigation
- **Portfolio**: View your asset allocation and performance
- **AI Recommendations**: Get personalized investment strategies
- **Auto-Optimizer**: Configure automatic portfolio rebalancing
- **Protocol Comparison**: Compare yields across different protocols

### 4. Execute Strategies
- Review AI-recommended allocation strategy
- Click "Execute Strategy" to implement in a single transaction
- Approve the transaction in your wallet
- Monitor execution progress in real-time

## Transaction Execution System

CompounDefi features a robust transaction system that:

1. Connects to your Aptos wallet securely
2. Prepares complex transactions based on AI recommendations
3. Presents detailed transaction information for your approval
4. Submits signed transactions to the Aptos blockchain
5. Monitors transaction status in real-time
6. Updates the UI with execution results

## Social Media Integration

Connect your social accounts to:
- Receive portfolio performance updates
- Get real-time alerts about market opportunities
- Stay informed about protocol updates and security notices
- Participate in community governance

## Development

### Project Structure
```
compoundefi/
├── client/             # Frontend React application
│   ├── public/         # Static assets
│   ├── src/            # Source code
│   │   ├── components/ # UI components
│   │   ├── context/    # React context providers
│   │   ├── hooks/      # Custom React hooks
│   │   ├── pages/      # Page components
│   │   ├── services/   # API and service functions
│   │   └── utils/      # Utility functions
├── server/             # Backend services (optional)
└── docs/               # Documentation
```

### Key Technologies

- **Frontend**: React, TailwindCSS, Framer Motion
- **State Management**: React Context API
- **Blockchain Interaction**: Aptos SDK, Wallet Adapters
- **Data Visualization**: Recharts
- **Testing**: Jest, React Testing Library

## Security Considerations

- All transactions require explicit user approval through their wallet
- No private keys are ever stored or transmitted by the application
- Smart contract interactions are thoroughly tested and audited
- Real-time security monitoring for protocol vulnerabilities

## Future Roadmap

- Support for additional Aptos protocols
- Cross-chain expansion to other L1/L2 networks
- Enhanced AI models for better market predictions
- Mobile application development
- Governance token and DAO implementation

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For questions or support, please reach out to:
- Discord: [CompounDefi Discord Server](https://discord.gg/compoundefi)
- Twitter: [@CompounDefi](https://twitter.com/compoundefi)
- Email: support@compoundefi.com

---

Built with ♥ by the CompounDefi Team