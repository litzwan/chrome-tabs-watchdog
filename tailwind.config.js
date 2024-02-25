/** @type {import('tailwindcss').Config} */

export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#293033',
          200: '#FCFCFC',
          300: '#F8AE64',
          400: '#66CC99',
          500: '#CD7766',
          600: '#9FA0A1',
          700: '#3D474C',
          800: '#14181A',
          900: '#434445',
        }
      }
    },
  },
  plugins: [],
};

