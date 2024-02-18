/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FAFAFA',
          200: '#292A2D',
          300: '#919193',
          400: '#657FF1',
          500: '#C33655',
          600: '#343538',
        }
      }
    },
  },
  plugins: [],
};

