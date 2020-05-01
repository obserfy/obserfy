module.exports = [{
      plugin: require('../node_modules/gatsby-plugin-layout/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-theme-ui/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-react-helmet-async/gatsby-browser.js'),
      options: {"plugins":[]},
    },{
      plugin: require('../node_modules/gatsby-plugin-manifest/gatsby-browser.js'),
      options: {"plugins":[],"name":"Obserfy","short_name":"Obserfy","start_url":"/","background_color":"#121212","theme_color":"#121212","display":"standalone","icon":"src/images/logo-standalone.svg"},
    },{
      plugin: require('../node_modules/gatsby-plugin-segment-js/gatsby-browser.js'),
      options: {"plugins":[],"prodKey":"a2pLn3x1wfkoSpgCxAb1sHiMRPraq6hW","devKey":"mmWAsCJqhsbHOArCtFhRCUvtAkr8WkzR","trackPage":true,"delayLoad":true,"delayLoadTime":1000},
    },{
      plugin: require('../node_modules/gatsby-plugin-intl3/gatsby-browser.js'),
      options: {"plugins":[],"path":"/Users/christianto/Project/vor/frontend/src/intl","languages":["en"],"defaultLanguage":"en","redirect":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-canonical-urls/gatsby-browser.js'),
      options: {"plugins":[],"siteUrl":"https://obserfy.com"},
    },{
      plugin: require('../node_modules/gatsby-plugin-nprogress/gatsby-browser.js'),
      options: {"plugins":[],"color":"#00a06d","showSpinner":false},
    },{
      plugin: require('../node_modules/gatsby-plugin-sentry/gatsby-browser.js'),
      options: {"plugins":[],"dsn":"https://05a5ecaa1d8c4c01b96d2a7993fa9337@sentry.io/1852524","environment":"development","release":"ab0df41","enabled":false},
    },{
      plugin: require('../gatsby-browser.js'),
      options: {"plugins":[]},
    }]
