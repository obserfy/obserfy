/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-var-requires,global-require */
const sentryPlugin =
  process.env.NODE_ENV === "production"
    ? [
        {
          resolve: "@sentry/gatsby",
          options: {
            dsn: "https://05a5ecaa1d8c4c01b96d2a7993fa9337@sentry.io/1852524",
            release: require("fs").readFileSync("../../../VERSION", "utf8"),
            tracesSampleRate: 0.1,
          },
        },
      ]
    : []

const graphqlCodeGen =
  process.env.NODE_ENV === "development"
    ? [
        {
          resolve: `gatsby-plugin-graphql-codegen`,
          options: {
            codegen: process.env.NODE_ENV === "development",
            fileName: `./graphql-types.ts`,
            documentPaths: ["./src/**/*.{ts,tsx}"],
          },
        },
      ]
    : []

// Only enable preact on prod. It has inconsistent fast-refresh behaviour and swallows all errors on dev,
// revisit later.
const preactPlugin =
  process.env.NODE_ENV === "production" ? [`gatsby-plugin-preact`] : []

module.exports = {
  flags: {
    FAST_DEV: true,
    FAST_REFRESH: true,
  },
  siteMetadata: {
    title: `Obserfy for Teachers`,
    description: `Record keeping tool for montessori schools.`,
    author: `@chrsep`,
    siteUrl: `https://app.obserfy.com`,
  },
  plugins: [
    ...preactPlugin,
    `gatsby-plugin-layout`,
    "gatsby-plugin-theme-ui",
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-plugin-image`,
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-remove-trailing-slashes`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Obserfy`,
        short_name: `Obserfy`,
        start_url: `/dashboard/students`,
        background_color: `#121212`,
        theme_color: `#121212`,
        display: `standalone`,
        icon: `src/images/logo-transparent.png`, // This path is relative to the root of the site.
        icon_options: {
          // For all the options available, please see the additional resources below.
          purpose: `any maskable`,
        },
      },
    },
    // `gatsby-plugin-offline`,
    `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-portal`,
    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        prodKey: `a2pLn3x1wfkoSpgCxAb1sHiMRPraq6hW`,
        devKey: `mmWAsCJqhsbHOArCtFhRCUvtAkr8WkzR`,
        trackPage: true,
        delayLoad: true,
        delayLoadTime: 1000,
      },
    },
    {
      resolve: "gatsby-plugin-svgr",
      options: {
        prettier: true, // use prettier to format JS code output (default)
        svgo: true, // use svgo to optimize SVGs (default)
        svgoConfig: {
          removeViewBox: true, // remove viewBox when possible (default)
          cleanupIDs: true, // remove unused IDs and minify remaining IDs (default)
        },
      },
    },
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://app.obserfy.com`,
      },
    },
    {
      resolve: `gatsby-plugin-nprogress`,
      options: {
        // Setting a color is optional.
        color: `#00a06d`,
        // Disable the loading spinner.
        showSpinner: false,
      },
    },
    ...sentryPlugin,
    ...graphqlCodeGen,
    {
      resolve: `gatsby-theme-i18n`,
      options: {
        defaultLang: `en`,
        configPath: require.resolve(`./i18n/config.json`),
      },
    },
    {
      resolve: `gatsby-theme-i18n-lingui`,
      options: {
        localeDir: `./i18n/lingui`,
      },
    },
    // DEVTOOLS ================================================================
    // {
    //   resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
    //   options: {
    //     analyzerPort: 3300,
    //   },
    // },
  ],
  developMiddleware: (app) => {
    app.use(
      "/api",
      require("http-proxy-middleware").createProxyMiddleware({
        secure: false,
        target: "https://localhost:8000",
      })
    )
    app.use(
      "/auth",
      require("http-proxy-middleware").createProxyMiddleware({
        secure: false,
        target: "https://localhost:8000",
      })
    )
  },
}
