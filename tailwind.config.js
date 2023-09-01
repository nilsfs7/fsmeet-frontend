/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // colors: {
      //   // white: '#F5F5F5',
      //   primary: '#7F0B26', // #34495E, 072F4C
      //   'primary-light': '#35688D',
      //   secondary: '#F6E9D7',
      //   'dark-green': '#38B000',
      //   'dark-red': '#E84142',
      // },
      colors: {
        background: '#d9d9e3', // omni 141414
        primary: '#072F4C',
        'primary-light': '#abb3c0',
        secondary: '#A1A1AA',
        title: '#000000',
        body: '#333333',
        'body-hover': '#d9d9e3',
        warning: '#FFE082',
      },
    },
  },
  plugins: [],
};
// abb3c0 silber-blau
