import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useWallet } from '@aptos-labs/wallet-adapter-react';

// Pages
import Dashboard from './pages/Dashboard';
import WalletAnalysis from './pages/WalletAnalysis';
import AIRecommendations from './pages/AIRecommendations';
import ProtocolComparison from './pages/ProtocolComparison';
import AutoOptimizer from './pages/AutoOptimizer';
import Settings from './pages/Settings';
import Landing from './pages/Landing';

// Components
import Navbar from './components/common/Navbar';
import Sidebar from './components/common/Sidebar';
import LoadingScreen from './components/common/LoadingScreen';
import WalletConnectModal from './components/common/WalletConnectModal';
import Notifications from './components/common/Notifications';
import MatrixBackground from './components/common/MatrixBackground';

// Context
import { WalletProvider } from './context/WalletContext';
import { DataProvider } from './context/DataContext';
import { NotificationProvider } from './context/NotificationContext';
import { TransactionProvider } from './context/TransactionContext';
import { UserProvider } from './context/UserContext';