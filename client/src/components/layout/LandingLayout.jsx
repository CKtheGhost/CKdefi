import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnect from '../common/WalletConnect';

/**
 * Layout component for the landing page
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Page content
 */
const LandingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Landing page header */}
      <header className="border-b border-gray-800 bg-gray-900/80 backdrop-blur-sm fixed top-0 w-full z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <img 
              src="/logo.svg" 
              alt="CompounDefi Logo" 
              className="h-8 w-8 mr-2"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/favicon.ico';
              }}
            />
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              CompounDefi
            </h1>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/#features" className="text-gray-300 hover:text-white">Features</Link>
            <Link to="/#protocols" className="text-gray-300 hover:text-white">Protocols</Link>
            <Link to="/#how-it-works" className="text-gray-300 hover:text-white">How It Works</Link>
            <a href="https://docs.compoundefi.app" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white">
              Docs
            </a>
          </div>
          
          <div>
            <WalletConnect />
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="pt-16">
        {children}
      </main>
      
      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 mt-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">CompounDefi</h3>
              <p className="text-gray-400 text-sm">
                AI-powered DeFi aggregator and yield optimizer for the Aptos blockchain.
              </p>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://docs.compoundefi.app" className="hover:text-white">Documentation</a></li>
                <li><a href="https://github.com/compoundefi" className="hover:text-white">GitHub</a></li>
                <li><a href="/faq" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Community</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="https://twitter.com/compoundefi" className="hover:text-white">Twitter</a></li>
                <li><a href="https://discord.gg/compoundefi" className="hover:text-white">Discord</a></li>
                <li><a href="https://t.me/compoundefi" className="hover:text-white">Telegram</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="/disclaimer" className="hover:text-white">Disclaimer</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex justify-between items-center">
            <p className="text-sm text-gray-500">
              &copy; {new Date().getFullYear()} CompounDefi. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a href="https://twitter.com/compoundefi" className="text-gray-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="https://github.com/compoundefi" className="text-gray-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="https://discord.gg/compoundefi" className="text-gray-500 hover:text-white">
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.245.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.069-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.069-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.21 0 2.176 1.077 2.157 2.38 0 1.312-.946 2.38-2.157 2.38z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingLayout;