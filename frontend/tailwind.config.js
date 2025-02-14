/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f8f9ff',
          100: '#e8eaff',
          200: '#d1d4ff',
          300: '#a7adff',
          400: '#7c85ff',
          500: '#4f46e5',
          600: '#4338ca',
          700: '#3730a3',
          800: '#312e81',
          900: '#282566',
        },
      },
    },
  },
  plugins: [],
}

