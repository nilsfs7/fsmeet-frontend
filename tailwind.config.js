/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#A1A1AA', 
        'primary-light': '#D4D4D8',
        secondary: '#A1A1AA', 
        'title': '#000000',
        'body': '#333333',
        'body-hover': '#d9d9e3',
      },
    },
  },
  plugins: [],
};
