/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customButton: '#263C66',
        customCard: '#0E1F40'
      }
    },
  },
  plugins: [],
}

