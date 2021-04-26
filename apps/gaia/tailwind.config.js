module.exports = {
  mode: "jit",
  important: true,
  purge: ["**/*.tsx"],
  theme: {
    extend: {
      colors: {
        surface: "#fff",
        background: "#fafafa",
        primary: "#00e399",
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
      },

      typography: {
        DEFAULT: {
          css: {
            color: "inherit",
            p: {
              opacity: 0.9,
            },
            strong: {
              color: "inherit",
            },
            h1: {
              color: "inherit",
            },
            h2: {
              color: "inherit",
            },
            h3: {
              color: "inherit",
            },
            h4: {
              color: "inherit",
            },
            h5: {
              color: "inherit",
            },
            h6: {
              color: "inherit",
            },
            a: {
              color: "inherit",
            },
            blockquote: {
              color: "inherit",
            },
          },
        },
        sm: {
          css: {
            h1: {
              fontSize: "1.4285714em",
              marginBottom: "0.8em",
              marginTop: "1.6em",
            },
            h2: {
              fontSize: "1.2857143em",
              marginBottom: "0.4444444em",
              marginTop: "0",
            },
            h3: {
              fontSize: "inherit",
              marginBottom: "0.5714286em",
              marginTop: "0",
            },
            h4: {
              fontSize: "inherit",
              fontWeight: "normal",
              marginBottom: 0,
            },
          },
        },
      },
    },
    fontFamily: {
      heading: ["Open Sans"],
      body: ["Open Sans"],
    },
  },
  // variants: {
  //   boxShadow: ["responsive", "responsive", "hover", "focus", "focus-within"],
  // },
  plugins: [require("@tailwindcss/typography")],
}
