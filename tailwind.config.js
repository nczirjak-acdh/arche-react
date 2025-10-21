/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx,mdx}',     // ← add
    './pages/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './src/**/*.{js,jsx,ts,tsx,mdx}',     // ← add if you use /src
  ],
  safelist: [
    'grid',
    'grid-cols-1',
    'sm:grid-cols-2',
    'md:grid-cols-4',
    // add any other classes that appear in remote HTML
  ],
  theme: {
    container: {

    },
    extend: {
      fontFamily: {
        custom: ['Lato', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
