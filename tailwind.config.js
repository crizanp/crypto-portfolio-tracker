/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#5c00e6',
        secondary: '#4cceac',
        warning: '#ffeb3b',
        danger: '#f44336',
        success: '#4caf50',
        info: '#2196f3',
      },
    },
  },
  plugins: [],
}