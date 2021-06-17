console.log("tailwind.config.js loaded");

const colors = require("tailwindcss/colors");

module.exports = {
  future: {},
  purge: [],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      gray: colors.trueGray,
      indigo: colors.indigo,
      red: colors.rose,
      yellow: colors.amber,
      orange: colors.orange,
    },
    extend: {
      zIndex: {
        "0": 0,
        "10": 10,
        "20": 20,
        "30": 30,
        "40": 40,
        "50": 50,
        "25": 25,
        "50": 50,
        "75": 75,
        "100": 100,
        "200": 200,
        "300": 300,
        "1000": 1000,
        auto: "auto",
      },
    },
  },
  variants: {},
  plugins: [],
};
