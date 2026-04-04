/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#7a532a',
          container: '#d9a777',
        },
        secondary: {
          DEFAULT: '#5a5e42',
          container: '#e1e6c2',
        },
        surface: {
          DEFAULT: '#f7f7f2',
          bright: '#f7f7f2',
          dim: '#d3d5cf',
        },
        on: {
          surface: '#2d2f2c',
          'surface-variant': '#5a5c58',
        }
      },
    },
  },
  plugins: [],
}