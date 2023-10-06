/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: '#141D26',
        'secondary-dark': '#ccd6dd',
        secondary: '#e1e8ed',
        'secondary-light': '#f8f9fa',
        warning: '#FFE082',
        critical: '#EE0000',
      },
    },
  },
  plugins: [],
};
