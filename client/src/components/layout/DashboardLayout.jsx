// DashboardLayout.jsx - Main application layout for CompounDefi dashboard

import { useState, useEffect } from 'react'; // Added import
import { useWalletContext } from '../../context/WalletContext';
import Navbar from '../common/Navbar';
import Sidebar from '../common/Sidebar';
import LoadingScreen from '../common/LoadingScreen';
import Notifications from '../common/Notifications';
import { checkApiStatus } from '../../services/api';

const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [appReady, setAppReady] = useState(false);
  const [apiOnline, setApiOnline] = useState(true);
  const { isConnected, portfolioLoading } = useWalletContext();

  useEffect(() => {
    const verifyApiStatus = async () => {
      try {
        await checkApiStatus();
        setApiOnline(true);
      } catch (error) {
        console.error('API status check failed:', error);
        setApiOnline(false);
      } finally {
        setAppReady(true);
      }
    };

    verifyApiStatus();
  }, []);

  // Toggle sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  // Close sidebar when clicking outside on mobile
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  // Show loading screen until app is ready
  if (!appReady) {
    return <LoadingScreen message="Initializing CompounDefi..." />;
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-dark-darker">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} closeSidebar={closeSidebar} />

      {/* Main content */}
      <div className="flex flex-col flex-1 w-full overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* API offline warning */}
        {!apiOnline && (
          <div className="w-full bg-red-500 text-white p-2 text-center">
            API connection failed. Some features may be unavailable.
          </div>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6 bg-gray-100 dark:bg-dark-darker">
          {/* Loading overlay for portfolio data */}
          {isConnected && portfolioLoading && (
            <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-dark-lighter p-4 rounded-lg shadow-lg flex items-center space-x-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin"></div>
                <span>Loading portfolio data...</span>
              </div>
            </div>
          )}

          {/* Page content */}
          <div className="container mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* Global notifications */}
      <Notifications />
    </div>
  );
};

export default DashboardLayout;

