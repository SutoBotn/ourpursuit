/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/components/**/*.{js,jsx}",
    "./src/pages/**/*.{js,jsx}",
  ],
  theme: {
    screens: {
      sm: "480px",
      md: "768px",
      lg: "976px",
      xl: "1440px",
    },
    colors: {
      white: "#FFFFFF",
      cream: "#EEE0CB",
      orange: "#BD632F",
      mustard: "#D8973C",
      brown: "#523A34",
      darkBrown: "#31241E",
      green: "#A3B18A",
      error: "#DC143C"
    },
    fontFamily: {
      'Better': ['Better', 'sans-serif'],
      'Montserrat': ['Montserrat', 'sans-serif']
    },
    extend: {
      fontSize: {
        '10xl': '12em'
      },
      zIndex: {
        100: 100,
      },

      keyframes: {
        show: {
          "0%, 49.99%": { opacity: 0, "z-index": 10 },
          "50%, 100%": { opacity: 1, "z-index": 50 },
        },
      },

      animation: {
        show: "show 0.7s",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
  ],
}
