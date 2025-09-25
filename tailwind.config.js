/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#2563eb',
          600: '#1d4ed8',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', ...fontFamily.sans],
        logo: ['var(--font-dancing-script)', 'cursive'],
      },
    },
  },
  plugins: [],
};
