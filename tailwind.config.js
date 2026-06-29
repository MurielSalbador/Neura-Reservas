module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#020617",
          900: "#080c24",
          800: "#11182f",
          700: "#17223f",
          600: "#1f2c54",
          500: "#2f3f8c",
          400: "#5b77e4",
          300: "#7f94ff",
          200: "#b4c0ff",
          100: "#dfe4ff",
        },
      },
      boxShadow: {
        glow: "0 32px 80px rgba(102, 109, 255, 0.16)",
      },
      animation: {
        marquee: "marquee 30s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
    },
  },
  plugins: [],
};
