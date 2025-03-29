// Sidebar.jsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  HomeIcon, 
  ChartPieIcon, 
  CurrencyDollarIcon, 
  SparklesIcon, 
  CogIcon, 
  UsersIcon,
  ArrowLeftOnRectangleIcon
} from '@heroicons/react/24/outline';
import { useUser } from '../../context/UserContext';

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useUser();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { name: 'Dashboard', icon: HomeIcon, path: '/dashboard' },
    { name: 'Wallet Analysis', icon: ChartPieIcon, path: '/wallet' },
    { name: 'AI Recommendations', icon: SparklesIcon, path: '/recommendations' },
    { name: 'Auto Optimizer', icon: CurrencyDollarIcon, path: '/optimizer' },
    { name: 'Protocol Comparison', icon: UsersIcon, path: '/protocols' },
    { name: 'Settings', icon: CogIcon, path: '/settings' }
  ];

  return (
    <div className={`h-screen flex flex-col bg-white dark:bg-gray-900 shadow-lg transition-all duration-300 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
        <div className={`flex items-center space-x-3 ${collapsed ? 'justify-center w-full' : ''}`}>
          <img src="/assets/images/defi-logo.png" alt="CompounDefi" className="h-8 w-8" />
          {!collapsed && <h1 className="text-xl font-bold">CompounDefi</h1>}
        </div>
        <button onClick={() => setCollapsed(!collapsed)} className={collapsed ? 'hidden' : ''}>
          {collapsed ? 
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg> :
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
          }
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.name}>
              <Link 
                to={item.path} 
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  location.pathname === item.path 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                } ${collapsed ? 'justify-center' : 'space-x-3'}`}
              >
                <item.icon className={`h-6 w-6 ${
                  location.pathname === item.path ? 'text-blue-600 dark:text-blue-400' : ''
                }`} />
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-200 dark:border-gray-800">
        <button 
          onClick={logout}
          className={`flex items-center p-3 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors ${collapsed ? 'justify-center' : 'space-x-3 w-full'}`}
        >
          <ArrowLeftOnRectangleIcon className="h-6 w-6" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;