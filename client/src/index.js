import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { ThemeProvider } from './context/ThemeContext';

// Only use the wallets we've actually installed
const wallets = [
  new MartianWallet()
];

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <AptosWalletAdapterProvider plugins={wallets} autoConnect={false}>
        <App />
      </AptosWalletAdapterProvider>
    </ThemeProvider>
  </React.StrictMode>
);