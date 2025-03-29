import React from "react";
import { motion } from "framer-motion";
import Card from "../common/Card";
import Notifications from "../common/Notifications";
import CardContent from "../common/Card";

/**
 * Enhanced Onboarding Layout for "CompounDefi"
 * Guides new users through AI-driven DeFi aggregator setup.
 */
const OnboardingLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-800 to-black text-white">
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-4 border-b border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-bold">CompounDefi</div>
            <div className="text-sm opacity-80">Onboarding Process</div>
          </div>
        </div>
      </motion.header>

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="flex-1 py-8 flex justify-center items-center"
      >
        <Card className="w-full max-w-3xl mx-auto p-4 shadow-lg">
          <CardContent>{children}</CardContent>
        </Card>
      </motion.main>

      <motion.footer
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="py-6 border-t border-gray-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="opacity-60 text-sm">
            © {new Date().getFullYear()} CompounDefi. All rights reserved.
          </p>
        </div>
      </motion.footer>

      <Notifications />
    </div>
  );
};

export default OnboardingLayout;
