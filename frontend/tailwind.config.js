/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6ff',
          100: '#dce8ff',
          200: '#b3ceff',
          300: '#80adff',
          400: '#4c86ff',
          500: '#2e63f5',
          600: '#1d48d2',
          700: '#193baa',
          800: '#173186',
          900: '#182c6c',
        },
      },
      boxShadow: {
        glass: '0 20px 45px rgba(23, 49, 134, 0.25)',
      },
    },
  },
  plugins: [],
}

