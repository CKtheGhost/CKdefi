import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

// Define theme types
const THEMES = {
  LIGHT: 'light',
  DARK: 'dark',
  SYSTEM: 'system'
};

// Create the theme context
const ThemeContext = createContext();

// Theme provider component
export function ThemeProvider({ children }) {
  // Get initial theme from localStorage or default to system preference
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('compoundefi-theme');
    return savedTheme || THEMES.SYSTEM;
  });

  // Track system preference
  const [systemTheme, setSystemTheme] = useState(
    window.matchMedia('(prefers-color-scheme: dark)').matches ? THEMES.DARK : THEMES.LIGHT
  );

  // Calculate the actual theme to apply
  const activeTheme = useMemo(() => {
    return theme === THEMES.SYSTEM ? systemTheme : theme;
  }, [theme, systemTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e) => {
      setSystemTheme(e.matches ? THEMES.DARK : THEMES.LIGHT);
    };
    
    // Add event listener (with backward compatibility)
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleChange);
    } else {
      // For older browsers
      mediaQuery.addListener(handleChange);
    }
    
    // Cleanup
    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleChange);
      } else {
        // For older browsers
        mediaQuery.removeListener(handleChange);
      }
    };
  }, []);

  // Apply theme to HTML element
  useEffect(() => {
    const htmlElement = document.documentElement;
    
    // Remove both theme classes
    htmlElement.classList.remove('light', 'dark');
    
    // Add the active theme class
    htmlElement.classList.add(activeTheme);
    
    // Store user preference
    if (theme !== THEMES.SYSTEM) {
      localStorage.setItem('compoundefi-theme', theme);
    }
  }, [activeTheme, theme]);

  // Change theme function
  const changeTheme = (newTheme) => {
    if (Object.values(THEMES).includes(newTheme)) {
      setTheme(newTheme);
      localStorage.setItem('compoundefi-theme', newTheme);
    } else {
      console.error(`Invalid theme: ${newTheme}. Must be one of: ${Object.values(THEMES).join(', ')}`);
    }
  };

  // Toggle between light and dark themes
  const toggleTheme = () => {
    if (activeTheme === THEMES.LIGHT) {
      changeTheme(THEMES.DARK);
    } else {
      changeTheme(THEMES.LIGHT);
    }
  };

  // Theme context value
  const value = {
    theme,
    activeTheme,
    isDarkMode: activeTheme === THEMES.DARK,
    isLightMode: activeTheme === THEMES.LIGHT,
    isSystemTheme: theme === THEMES.SYSTEM,
    systemPreference: systemTheme,
    changeTheme,
    toggleTheme,
    THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use the theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Helper function to create theme-specific styles or classes
export function createThemedStyles(lightStyles, darkStyles) {
  const { activeTheme } = useTheme();
  return activeTheme === THEMES.DARK ? darkStyles : lightStyles;
}

// Theming constants for consistent styling
export const THEME_COLORS = {
  [THEMES.LIGHT]: {
    primary: '#3b82f6', // Blue
    secondary: '#10b981', // Green
    accent: '#8b5cf6', // Purple
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    background: '#ffffff',
    card: '#f9fafb',
    text: {
      primary: '#1f2937',
      secondary: '#6b7280',
      muted: '#9ca3af'
    },
    border: '#e5e7eb',
    divider: '#f3f4f6'
  },
  [THEMES.DARK]: {
    primary: '#3b82f6', // Blue
    secondary: '#10b981', // Green
    accent: '#8b5cf6', // Purple
    warning: '#f59e0b', // Amber
    danger: '#ef4444', // Red
    background: '#111827',
    card: '#1f2937',
    text: {
      primary: '#f9fafb',
      secondary: '#e5e7eb',
      muted: '#9ca3af'
    },
    border: '#374151',
    divider: '#1f2937'
  }
};