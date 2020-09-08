/* eslint-disable @typescript-eslint/camelcase,@typescript-eslint/no-var-requires,global-require */
require("dotenv").config({
  path: `.env`,
})

// Conditionally load guess js
const guessJsPlugin =
  process.env.GA_PRIVATE_KEY &&
  process.env.GA_CLIENT_EMAIL &&
  process.env.CYPRESS_SUPPORT !== "y"
    ? [
        {
          resolve: "gatsby-plugin-guess-js",
          options: {
            // Find the view id in the GA admin in a section labeled "views"
            GAViewID: `211863061`,
            // Add a JWT to get data from GA
            jwt: {
              private_key: process.env.GA_PRIVATE_KEY.replace(/\\n/g, "\n"),
              client_email: process.env.GA_CLIENT_EMAIL,
            },
            minimumThreshold: 0.03,
            // The "period" for fetching analytic data.
            period: {
              startDate: new Date("2020-1-1"),
              endDate: new Date(),
            },
          },
        },
      ]
    : []

module.exports = {
  siteMetadata: {
    title: `Obserfy`,
    description: `Obserfy`,
    author: `@chrsep`,
  },
  plugins: [
    `gatsby-plugin-layout`,
    "gatsby-plugin-theme-ui",
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-preact`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
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
        icon: `src/images/logo-standalone.svg`, // This path is relative to the root of the site.
      },
    },
    // this (optional) plugin enables Progressive Web App + Offline functionality
    // To learn more, visit: https://gatsby.dev/offline
    {
      resolve: `gatsby-plugin-offline`,
      options: {
        workboxConfig: {
          // globPatterns: ["**/icon-path*"],
          runtimeCaching: [
            // inspired by next-pwa's https://github.com/shadowwalker/next-pwa/blob/1d6ace1ec501638fa1feb7dd2526c1ef1d62210e/cache.js#L87-L99
            {
              urlPattern: /\/api\/.*$/i,
              handler: "NetworkFirst",
              method: "GET",
              options: {
                cacheName: "apis",
                expiration: {
                  maxEntries: 64,
                  maxAgeSeconds: 3 * 24 * 60 * 60, // 24 hours
                },
                networkTimeoutSeconds: 10, // fall back to cache if api does not response within 10 seconds
              },
            },
          ],
        },
      },
    },
    // `gatsby-plugin-remove-serviceworker`,
    `gatsby-plugin-emotion`,
    `gatsby-plugin-portal`,
    {
      resolve: `gatsby-plugin-segment-js`,
      options: {
        // your segment write key for your production environment
        // when process.env.NODE_ENV === 'production'
        // required; non-empty string
        // TODO: Do not hardcode this, use env variables.
        prodKey: `a2pLn3x1wfkoSpgCxAb1sHiMRPraq6hW`,

        devKey: `mmWAsCJqhsbHOArCtFhRCUvtAkr8WkzR`,
        // boolean (defaults to false) on whether you want
        // to include analytics.page() automatically
        // if false, see below on how to track pageviews manually
        trackPage: true,

        // boolean (defaults to false); whether to delay load Segment
        // ADVANCED FEATURE: only use if you leverage client-side routing (ie, Gatsby <Link>)
        // This feature will force Segment to load _after_ either a page routing change
        // or user scroll, whichever comes first. This delay time is controlled by
        // `delayLoadTime` setting. This feature is used to help improve your website's
        // TTI (for SEO, UX, etc).  See links below for more info.
        // NOTE: But if you are using server-side routing and enable this feature,
        // Segment will never load (because although client-side routing does not do
        // a full page refresh, server-side routing does, thereby preventing Segment
        // from ever loading).
        // See here for more context:
        // GIF: https://github.com/benjaminhoffman/gatsby-plugin-segment-js/pull/19#issuecomment-559569483
        // TTI: https://github.com/GoogleChrome/lighthouse/blob/master/docs/scoring.md#performance
        // Problem/solution: https://marketingexamples.com/seo/performance
        delayLoad: true,

        // number (default to 1000); time to wait after scroll or route change
        // To be used when `delayLoad` is set to `true`
        delayLoadTime: 1000,
      },
    },
    // {
    //   resolve: "gatsby-plugin-crisp-chat",
    //   options: {
    //     websiteId: "d46cf62a-1614-4ccc-88b8-ef616bbc8fcd",
    //     enableDuringDevelop: false, // Optional. Disables Crisp Chat during gatsby develop. Defaults to true.
    //     defer: true, // Optional. Sets the Crisp loading script to defer instead of async. Defaults to false.
    //   },
    // },
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
      resolve: `gatsby-plugin-prefetch-google-fonts`,
      options: {
        fonts: [
          {
            family: `Open Sans`,
            variants: [`400`, `700`],
          },
        ],
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
    {
      resolve: "@sentry/gatsby",
      options: {
        dsn: "https://05a5ecaa1d8c4c01b96d2a7993fa9337@sentry.io/1852524",
        release: require("fs").readFileSync("../../../VERSION", "utf8"),
        tracesSampleRate: 0.1, // this is just to test, you should lower this in production
      },
    },
    {
      resolve: `gatsby-plugin-graphql-codegen`,
      options: {
        codegen: process.env.NODE_ENV === "development",
        fileName: `./graphql-types.ts`,
        documentPaths: ["./src/**/*.{ts,tsx}"],
      },
    },
    ...guessJsPlugin,
    // DEVTOOLS ================================================================
    {
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      options: {
        analyzerPort: 3300,
        disable: true,
      },
    },
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
