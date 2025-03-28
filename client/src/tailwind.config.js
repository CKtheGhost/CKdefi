// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
          light: '#60A5FA',   // blue-400
        },
        secondary: {
          DEFAULT: '#10B981', // green-500
          dark: '#059669',    // green-600
          light: '#34D399',   // green-400
        },
        aptos: {
          DEFAULT: '#4D5ED3',  // Aptos brand blue
          dark: '#3C4CAB',     // darker blue
          accent: '#8DABFE',   // lighter blue
          light: '#E8EDFF',    // very light blue
        },
        dark: {
          DEFAULT: '#1F2937', // gray-800
          lighter: '#374151', // gray-700
          darker: '#111827',  // gray-900
        },
        success: '#22C55E',   // green-500
        warning: '#F59E0B',   // amber-500
        error: '#EF4444',     // red-500
        info: '#0EA5E9',      // sky-500
      },
      boxShadow: {
        card: '0 2px 4px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      fontSize: {
        'xxxs': '0.5rem',
        'xxs': '0.625rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
    require('@tailwindcss/aspect-ratio'),
    require('@tailwindcss/line-clamp'),
  ],
}