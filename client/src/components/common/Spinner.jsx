// Nexus-level Spinner.jsx
// Provides a minimal, futuristic loading spinner for partial content.

import React from 'react';

/**
 * Displays a simple spinner to indicate loading state.
 */
export const Spinner = () => {
  return (
    <div className="flex justify-center items-center p-8 animate-fadeIn">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  );
};

export default Spinner;
