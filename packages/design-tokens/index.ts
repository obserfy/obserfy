const themeUiTheme = {
  useColorSchemeMediaQuery: true,
  colors: {
    // Base color
    text: "rgba(0,0,0,0.87)",
    textMediumEmphasis: "rgba(0,0,0, 0.60)",
    textDisabled: "rgba(0,0,0, 0.38)",
    textPrimary: "#027c5b",

    background: "#F7F8FA",
    onBackground: "rgba(0,0,0,0.87)",

    // Primary Color
    primary: "#00e399",
    onPrimary: "#000",

    primaryDark: "#00a06d",
    onPrimaryDark: "#fff",

    primaryLight: "#629749",
    onPrimaryLight: "text",

    primaryLighter: "rgba(0,120,86,0.12)",
    onPrimaryLighter: "text",

    primaryLightest: "rgba(0,120,86,0.05)",
    onPrimaryLightest: "text",

    secondary: "#30c",
    onSecondary: "#fff",

    surface: "#fff",
    onSurface: "#87000000",

    surfaceTransparent: "rgba(255,255,255,0.965)",
    onSurfaceTransparent: "#87000000",

    surfaceBlurTransparent: "rgba(255,255,255,0.6)",
    onSurfaceBlurTransparent: "#87000000",

    border: "rgba(0,0,0,.1)",
    borderEmphasized: "#cfcfd3",

    overlay: "rgba(0,0,0,.6)",
    onOverlay: "#fff",

    muted: "#f6f6f9",
    mutedLight: "#fcfcff",

    gray: "#dddddf",
    highlight: "hsla(205, 100%, 40%, 0.125)",

    icon: "rgba(0,0,0,0.6)",

    error: "#d50000",
    onError: "#FFFFFF",

    warning: "#ff6d00",
    onWarning: "rgba(0,0,0,0.87)",
    tintWarning: "rgba(255,199,1,0.2)",

    danger: "#d50000",
    onDanger: "#FFFFFF",

    tintYellow: "rgba(255,199,1,0.2)",
    onTintYellow: "yellow",

    tintError: "rgba(213,0,0,0.08)",
    onTintError: "#c40000",

    materialStage: {
      presented: "#dd2c00",
      onPresented: "text",

      practiced: "#ffab00",
      onPracticed: "black",

      mastered: "#00c853",
      onMastered: "black",
    },
    modes: {
      dark: {
        text: "rgba(255,255,255, 0.87)",
        textMediumEmphasis: "rgba(255,255,255, 0.60)",
        textDisabled: "rgba(255,255,255, 0.38)",
        textPrimary: "#00a875",

        primary: "#00a875",
        onPrimary: "#000",

        background: "#101010",
        onBackground: "rgba(255,255,255, 0.87)",

        surface: "#1d1d1d",
        onSurface: "rgba(255,255,255, 0.87)",

        surfaceTransparent: "rgba(29,29,29,0.975)",
        onSurfaceTransparent: "rgba(255,255,255, 0.87)",

        surfaceBlurTransparent: "rgba(29,29,29,0.6)",
        onSurfaceBlurTransparent: "rgba(255,255,255, 0.87)",

        primaryDark: "#009c6e",
        onPrimaryDark: "rgba(255,255,255, 0.87)",

        icon: "#979797",

        border: "rgba(255,255,255, 0.05)",

        muted: "#222222",
        mutedLight: "#212121",

        overlay: "rgba(0,0,0,.6)",
        onOverlay: "#fff",

        warning: "#ffd600",
        onWarning: "rgba(0,0,0,0.87)",
        tintWarning: "rgba(255,199,1,0.08)",

        tintError: "rgba(213,0,0,0.08)",
        onTintError: "#ff0000",

        error: "#ff0000",
        onError: "#000",
      },
    },
  },
  fonts: {
    body:
      "Open Sans,-apple-system,BlinkMacSystemFont,San Francisco,Roboto,Segoe UI,Helvetica Neue,sans-serif ",
    heading:
      "Open Sans,-apple-system,BlinkMacSystemFont,San Francisco,Roboto,Segoe UI,Helvetica Neue,sans-serif ",
  },
  fontSizes: [12, 14, 16, 20, 24, 32, 48, 64, 96],
  fontWeights: {
    heading: 300,
    body: 400,
  },
  space: [0, 4, 8, 16, 32, 64, 128, 256, 512],
  sizes: {
    avatar: 48,
    appbar: 57,
    sidebar: {
      mobile: 360,
      desktop: 230,
    },
    icon: 20,
    table: {
      row: 60,
      header: 70,
    },
    maxWidth: {
      xsm: 500,
      sm: 640,
      md: 700,
      lg: 900,
    },
  },
  radii: {
    default: 8,
    circle: 99999,
  },
  shadows: {
    low: "rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.27) 0px 2px 4px -2px",
  },
}

const rebassVariants = {
  // rebass variants
  text: {
    heading: {
      color: "rgba(0,0,0,0.88)",
      fontFamily: "heading",
      fontWeight: "light",
      marginBottom: "3rem",
      letterSpacing: "0em",
    },
    h1: {
      variant: "heading",
      fontSize: "6.103515625rem",
      lineHeight: "9rem",
      letterSpacing: 0,
    },
    h2: {
      variant: "heading",
      fontSize: "4.8828125rem",
      lineHeight: "6rem",
      letterSpacing: 0,
    },
    h3: {
      variant: "heading",
      fontSize: "3.90625rem",
      lineHeight: "6rem",
      letterSpacing: 0,
    },
    h4: {
      variant: "heading",
      fontSize: "3.125rem",
      lineHeight: "6rem",
      letterSpacing: 0,
    },
    h5: {
      variant: "heading",
      fontSize: "2.5rem",
      lineHeight: "3rem",
      letterSpacing: 0,
    },
    h6: {
      variant: "heading",
      fontSize: "2rem",
      lineHeight: "3rem",
      letterSpacing: 0,
    },
    body: {
      color: "rgba(0,0,0,0.88)",
      fontSize: "1.6rem",
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "3rem",
    },
  },
  variants: {
    avatar: {
      width: "avatar",
      height: "avatar",
      borderRadius: "circle",
    },
    card: {
      p: 2,
      bg: "background",
      borderRadius: "default",
      boxShadow:
        "rgba(0, 0, 0, 0.1) 0px 0px 1px, rgba(0, 0, 0, 0.27) 0px 2px 4px -2px",
    },
    link: {
      color: "primary",
    },
    nav: {
      fontSize: 1,
      fontWeight: "bold",
      display: "inline-block",
      p: 2,
      color: "inherit",
      textDecoration: "none",
      ":hover,:focus,.active": {
        color: "primary",
      },
    },
  },
  buttons: {
    primary: {
      cursor: "pointer",
      textTransform: "capitalize",
      boxSizing: "border-box",
      fontSize: 1,
      fontWeight: "bold",
      color: "onPrimary",
      bg: "primary",
      borderRadius: "default",
      fontFamily: "body",
      transition: "background-color 125ms cubic-bezier(0.0, 0.0, 0.2, 1)",
      py: 2,
      px: 3,
      whiteSpace: "nowrap",
      "&:disabled": {
        opacity: 0.38,
        cursor: "auto",
      },
      "&:hover, &:focus": {
        backgroundColor: "primaryDark",
        outline: "none",
        "&:disabled": {
          backgroundColor: "primary",
        },
      },
    },
    primaryBig: {
      variant: "buttons.primary",
      py: 3,
    },
    secondary: {
      variant: "buttons.primary",
      color: "textPrimary",
      bg: "transparent",
      "&:hover, &:focus": {
        backgroundColor: "primaryLighter",
        borderColor: "primary",
        outline: "none",
      },
    },
    secondaryBig: {
      variant: "buttons.secondary",
      py: 3,
    },
    outline: {
      variant: "buttons.secondary",
      border: "1px solid",
      borderColor: "border",
      "&:hover, &:focus": {
        backgroundColor: "primaryLighter",
        borderColor: "primary",
        outline: "none",
        "&:disabled": {
          backgroundColor: "transparent",
          borderColor: "border",
        },
      },
    },
    outlineBig: {
      variant: "buttons.outline",
      py: 3,
    },
  },
  styles: {
    root: {
      fontFamily: "body",
      fontWeight: "body",
      lineHeight: "body",
    },
  },
  forms: {
    input: {
      fontFamily: "body",
      width: "auto",
      borderColor: "border",
      backgroundColor: "surface",
      fontSize: 2,
      p: 12,
      color: "text",
      "&:hover, &:focus": {
        borderColor: "primary",
        outline: "none",
      },
      "&::placeholder": {
        fontStyle: "italic",
      },
      "&:disabled": {
        opacity: 0.68,
        borderColor: "border",
        color: "textDisabled",
      },
    },
    select: {
      color: "text",
      fontFamily: "body",
      borderColor: "border",
      backgroundColor: "surface",
      fontSize: 2,
      p: 12,
      "&:hover, &:focus": {
        borderColor: "primary",
        outline: "none",
      },
    },
    textarea: {
      fontFamily: "body",
      borderColor: "border",
      backgroundColor: "surface",
      fontSize: 2,
      p: 3,
      height: 180,
      resize: "vertical",
      color: "text",
      "&:hover, &:focus": {
        borderColor: "primary",
        outline: "none",
      },
      "&::placeholder": {
        fontStyle: "italic",
        lineHeight: "2rem",
      },
    },
  },
  label: {
    color: "textMediumEmphasis",
    as: "label",
    fontFamily: "body",
    fontSize: 1,
    userSelect: "none",
  },
  loadingPlaceholder: {
    text: {
      height: "1em",
    },
  },
}

const Theme = {
  ...themeUiTheme,
  ...rebassVariants,
}

export type Theme = typeof Theme
export default Theme
