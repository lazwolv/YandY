/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f0f8',
          100: '#e6d9ed',
          200: '#d4bfe0',
          300: '#bfa0d0',
          400: '#a67dbd',
          500: '#8d60a9',
          600: '#7a4f93',
          700: '#6f4a87',
          800: '#5c3d6f',
          900: '#4d335c',
        },
        secondary: {
          light: '#a67dbd',
          DEFAULT: '#8d60a9',
          dark: '#6f4a87',
        },
        purple: {
          light: '#a67dbd',
          DEFAULT: '#8d60a9',
          dark: '#6f4a87',
        },
      },
    },
  },
  plugins: [],
};
