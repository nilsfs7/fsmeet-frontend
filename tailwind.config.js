/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: '#ffffff',
        primary: '#ccd6dd',
        'primary-light': '#f8f9fa',
        secondary: '#e1e8ed',
        title: '#000000',
        border: '#ccd6dd',
        'action-bg': '#000000',
        'action-font': '#ffffff',
        hover: '#f8f9fa',
        'hover-border': '#000000',
        body: '#333333',
        'body-hover': '#d9d9e3',
        warning: '#FFE082',
      },
    },
  },
  plugins: [],
};
