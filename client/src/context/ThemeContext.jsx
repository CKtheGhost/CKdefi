import React, { createContext, useState, useEffect } from 'react';

// Define available themes
export const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Create the context
export const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  // State to track the selected theme preference
  const [themePreference, setThemePreference] = useState(THEMES.SYSTEM);
  
  // State to track the actual theme that's applied (light or dark)
  const [activeTheme, setActiveTheme] = useState(THEMES.LIGHT);

  // Update active theme based on preference and system setting
  useEffect(() => {
    // Load theme preference from localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme && Object.values(THEMES).includes(savedTheme)) {
      setThemePreference(savedTheme);
    }
    
    // Function to set the active theme
    const updateActiveTheme = () => {
      if (themePreference === THEMES.SYSTEM) {
        // Use system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setActiveTheme(prefersDark ? THEMES.DARK : THEMES.LIGHT);
      } else {
        // Use explicitly selected theme
        setActiveTheme(themePreference);
      }
    };
    
    // Initial update
    updateActiveTheme();
    
    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (themePreference === THEMES.SYSTEM) {
        updateActiveTheme();
      }
    };
    
    // Add listener for modern browsers
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // Fallback for older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', activeTheme);
    
    if (activeTheme === THEMES.DARK) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Cleanup function
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        mediaQuery.removeListener(handleChange);
      }
    };
  }, [themePreference, activeTheme]);

  // Function to update theme preference
  const setTheme = (theme) => {
    if (Object.values(THEMES).includes(theme)) {
      setThemePreference(theme);
      localStorage.setItem('theme', theme);
    }
  };

  // Context value
  const value = {
    themePreference,
    activeTheme,
    setTheme,
    isLightMode: activeTheme === THEMES.LIGHT,
    isDarkMode: activeTheme === THEMES.DARK
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === null) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};