module.exports = {
  purge: {
    mode: "all",
    content: [
      "./src/**/*.tsx",
    ],
  },
  important: true,
  theme: {
    extend: {

      fontFamily: {
        heading: ["Open Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
        body: ["Open Sans", "system-ui", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
      colors: {
        primary: "#00e399",
        primaryDark: "#01815c",
      },
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
    standardFontWeights: true,
    defaultLineHeights: true,
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
}
