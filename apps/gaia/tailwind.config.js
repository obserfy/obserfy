/* eslint-disable import/no-extraneous-dependencies */
module.exports = {
  content: ["**/*.tsx"],
  theme: {
    extend: {
      spacing: {
        sidebar: 240,
        "bottom-navigation": 100,
      },
      maxWidth: {
        sidebar: "calc(100% - 40px)",
      },
      colors: {
        surface: "#fff",
        background: "#fafafa",
        onPrimary: "#000",
        overlay: "rgba(0, 0, 0, 0.8)",

        primaryLightest: "rgba(0,227,153,0.05)",
        onPrimaryLightest: "text",

        assessments: {
          presented: "#dd2c00",
          onPresented: "white",

          practiced: "#ffab00",
          onPracticed: "black",

          mastered: "#00c853",
          onMastered: "black",
        },

        primary: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
      },
      // screen: {
      //   installed: { raw: "(display-mode: standalone)" },
      //   "not-installed": { raw: "not(display-mode: standalone)" },
      // },

      // typography: {
      //   DEFAULT: {
      //     css: {
      //       color: "inherit",
      //       p: {
      //         opacity: 0.9,
      //       },
      //       strong: {
      //         color: "inherit",
      //       },
      //       h1: {
      //         color: "inherit",
      //       },
      //       h2: {
      //         color: "inherit",
      //       },
      //       h3: {
      //         color: "inherit",
      //       },
      //       h4: {
      //         color: "inherit",
      //       },
      //       h5: {
      //         color: "inherit",
      //       },
      //       h6: {
      //         color: "inherit",
      //       },
      //       a: {
      //         color: "inherit",
      //       },
      //       blockquote: {
      //         color: "inherit",
      //       },
      //     },
      //   },
      //   sm: {
      //     css: {
      //       h1: {
      //         fontSize: "1.4285714em",
      //         marginBottom: "0.8em",
      //         marginTop: "1.6em",
      //       },
      //       h2: {
      //         fontSize: "1.2857143em",
      //         marginBottom: "0.4444444em",
      //         marginTop: "0",
      //       },
      //       h3: {
      //         fontSize: "inherit",
      //         marginBottom: "0.5714286em",
      //         marginTop: "0",
      //       },
      //       h4: {
      //         fontSize: "inherit",
      //         fontWeight: "normal",
      //         marginBottom: 0,
      //       },
      //     },
      //   },
      // },
    },
    fontFamily: {
      heading: ["Source Sans Pro"],
      body: ["Source Sans Pro"],
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
}
