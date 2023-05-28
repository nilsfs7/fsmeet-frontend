/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#F5F5F5',
        primary: '#18181B', // zinc-900
        'primary-light': '#F5F5F5',
        secondary: '#A1A1AA', // zinc-400
        'dark-green': '#38B000',
        'dark-red': '#E84142',
        'primary-blue': '#00F0EC',
        'primary-green': '#16FFC5',
      },
    },
  },
  plugins: [],
};
