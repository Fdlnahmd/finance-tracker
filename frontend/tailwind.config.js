/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f4f3ff',
          100: '#e9e7ff',
          200: '#dedcff', // Secondary Realtime
          300: '#bebaff',
          400: '#9e97ff',
          500: '#2f27ce', // Primary Realtime
          600: '#2821b0',
          700: '#1d177f',
          800: '#130f54',
          900: '#0a082c',
          950: '#070520',
        },
        accent: {
          DEFAULT: '#433bff', // Accent Realtime
          50: '#f5f4ff',
          100: '#ebe9ff',
          200: '#dedcff',
          500: '#433bff',
          600: '#3830e6',
          700: '#2c25bf',
        },
        realtime: {
          bg: '#fbfbfe',
          text: '#050315',
          darkBg: '#050315',
          darkText: '#fbfbfe',
          card: '#0d0c24',
          border: '#e4e2fc',
          darkBorder: '#1b193d'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
