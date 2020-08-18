module.exports = {
  purge: ["**/*.tsx"],
  theme: {
    extend: {
      colors: {
        surface: "#fff",
        background: "#fafafa",
        primary: "#00e399",
        onPrimary: "#000",
        overlay: "rgba(0, 0, 0, 0.8)",
      },
    },
    fontFamily: {
      heading: ["Open Sans"],
      body: ["Open Sans"],
    },
  },
  variants: {
    boxShadow: ["responsive", "responsive", "hover", "focus", "focus-within"],
  },
  plugins: [],
}
