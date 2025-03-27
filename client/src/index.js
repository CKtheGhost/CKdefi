import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { PetraWallet } from 'petra-plugin-wallet-adapter';
import { MartianWallet } from '@martianwallet/aptos-wallet-adapter';
import { PontemWallet } from '@pontem/wallet-adapter-plugin';
import { ThemeProvider } from './context/ThemeContext';

// Initialize wallets
const wallets = [
  new PetraWallet(),
  new MartianWallet(),
  new PontemWallet()
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