// tailwind.config.js
module.exports = {
  important: true,
  theme: {
    fontFamily: {
      heading: ["Crimson Text"],
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
