
const colors = require('tailwindcss/colors');

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    // Extend the entire colors object
    colors: {
      // Keep all the standard, safe colors
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      red: colors.red,
      green: colors.green,
      yellow: colors.yellow,
      // Add other color sets if you use them, e.g., 'emerald', 'sky'

      // **OVERRIDE the problematic colors with safe, non-oklch versions**
      gray: {
        50: '#f9fafb',
        100: '#f3f4f6',
        200: '#e5e7eb',
        300: '#d1d5db',
        400: '#9ca3af',
        500: '#6b7280',
        600: '#4b5563',
        700: '#374151',
        800: '#1f2937',
        900: '#111827',
      },
      blue: {
        100: '#dbeafe',
        200: '#bfdbfe',
        600: '#2563eb',
        700: '#1d4ed8',
        800: '#1e40af',
      },
      purple: {
        100: '#ede9fe',
        200: '#ddd6fe',
        600: '#7c3aed',
        700: '#6d28d9',
      },
      indigo: { // used for focus rings
        500: '#6366f1',
      }
    },
    extend: {},
  },
  plugins: [],
}