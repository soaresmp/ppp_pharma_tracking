/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ppb: {
          green: '#006B3F',
          'green-dark': '#004d2d',
          'green-light': '#e6f4ee',
          gold: '#D4AF37',
          red: '#CE1126',
          navy: '#1a2b52',
        }
      }
    },
  },
  plugins: [],
}


