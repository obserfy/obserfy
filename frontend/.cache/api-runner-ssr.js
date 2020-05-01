var plugins = [{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-layout/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-theme-ui/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-react-helmet-async/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-manifest/gatsby-ssr'),
      options: {"plugins":[],"name":"Obserfy","short_name":"Obserfy","start_url":"/","background_color":"#121212","theme_color":"#121212","display":"standalone","icon":"src/images/logo-standalone.svg"},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-portal/gatsby-ssr'),
      options: {"plugins":[]},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-segment-js/gatsby-ssr'),
      options: {"plugins":[],"prodKey":"a2pLn3x1wfkoSpgCxAb1sHiMRPraq6hW","devKey":"mmWAsCJqhsbHOArCtFhRCUvtAkr8WkzR","trackPage":true,"delayLoad":true,"delayLoadTime":1000},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-prefetch-google-fonts/gatsby-ssr'),
      options: {"plugins":[],"fonts":[{"family":"Open Sans","variants":["300","400"]}]},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-intl3/gatsby-ssr'),
      options: {"plugins":[],"path":"/Users/christianto/Project/vor/frontend/src/intl","languages":["en"],"defaultLanguage":"en","redirect":false},
    },{
      plugin: require('/Users/christianto/Project/vor/frontend/node_modules/gatsby-plugin-canonical-urls/gatsby-ssr'),
      options: {"plugins":[],"siteUrl":"https://obserfy.com"},
    }]
// During bootstrap, we write requires at top of this file which looks like:
// var plugins = [
//   {
//     plugin: require("/path/to/plugin1/gatsby-ssr.js"),
//     options: { ... },
//   },
//   {
//     plugin: require("/path/to/plugin2/gatsby-ssr.js"),
//     options: { ... },
//   },
// ]

const apis = require(`./api-ssr-docs`)

// Run the specified API in any plugins that have implemented it
module.exports = (api, args, defaultReturn, argTransform) => {
  if (!apis[api]) {
    console.log(`This API doesn't exist`, api)
  }

  // Run each plugin in series.
  // eslint-disable-next-line no-undef
  let results = plugins.map(plugin => {
    if (!plugin.plugin[api]) {
      return undefined
    }
    const result = plugin.plugin[api](args, plugin.options)
    if (result && argTransform) {
      args = argTransform({ args, result })
    }
    return result
  })

  // Filter out undefined results.
  results = results.filter(result => typeof result !== `undefined`)

  if (results.length > 0) {
    return results
  } else {
    return [defaultReturn]
  }
}
