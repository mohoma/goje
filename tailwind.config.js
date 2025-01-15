/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#3E7B27',
          DEFAULT: '#3E7B27',
          dark: '#3E7B27',
        },
        secondary: {
          light: '#85A947',
          DEFAULT: '#85A947',
          dark: '#85A947',
        },
      }
    },
  },
  plugins: [],
};
