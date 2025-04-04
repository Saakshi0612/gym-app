/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          green: "#9ef300",
          white: "#ffffff",
          black: "#323a3a",
        },
        semantic: {
          blue: "#4eb7fc",
          yellow: "#fdd63b",
          red: "#ff4242",
          grey: "#6c6f80",
        },
        neutral: {
          900: "#323232",
          700: "#4b5563",
          600: "#909090",
          500: "#b7b6b6",
          400: "#dadada",
          200: "#eeeeee",
        },
        green: {
          100: "#f6ffe5",
          50: "#fbfff5",
        },
      },
    },
  },
  plugins: [],
}