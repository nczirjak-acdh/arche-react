/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1rem', // ≈ px-4 on all screens; tweak as you like
      screens: {
        sm: '540px',
        md: '720px',
        lg: '960px',
        xl: '1140px',
        '2xl': '1320px', // Bootstrap's xxl
      },
    },
    extend: {
      fontFamily: {
        custom: ['Lato', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
      screens: {
        sm: '576px',
        md: '768px',
        lg: '992px',
        xl: '1200px',
        '2xl': '1400px',
      },
    },
  },
  plugins: [],
};
