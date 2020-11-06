module.exports = {
  siteMetadata: {
    title: `Obserfy`,
    description: `Obserfy landing page`,
    author: `@chrsep`,
    siteUrl: `https://obserfy.com`
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    `gatsby-plugin-preact`,
    `gatsby-plugin-postcss`,
    `gatsby-plugin-netlify-cache`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-netlify`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Obserfy`,
        short_name: `Obserfy`,
        start_url: `/`,
        background_color: `#ffffff`,
        theme_color: `#ffffff`,
        display: `standalone`,
        icon: `src/images/logo-standalone.svg`, // This path is relative to the root of the site.
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
          {
            family: `Crimson Text`,
            variants: [`600`],
          },
        ],
      },
    },
    {
      resolve: "gatsby-plugin-webpack-bundle-analyser-v2",
      options: {
        analyzerPort: 3000,
        disable: true,
      },
    },
    `gatsby-plugin-remove-trailing-slashes`,
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
  ],
}
