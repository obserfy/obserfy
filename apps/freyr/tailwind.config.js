module.exports = {
  important: true,
  theme: {
    fontFamily: {
      heading: ["Open Sans"],
      body: ["Open Sans"],
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
