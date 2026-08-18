/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        red: {
          DEFAULT: '#E51913',
          dark: '#C41712',
          light: '#FFE8E7',
        },
        blue: {
          DEFAULT: '#3BBCEB',
          dark: '#2A9FD4',
          light: '#E8F7FE',
        },
        grey: {
          DEFAULT: '#8A8C8E',
          dark: '#4A4C4E',
          light: '#F5F6F7',
        },
      },
    },
  },
  plugins: [],
};