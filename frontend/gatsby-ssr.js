/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/ssr-apis/
 */

// You can delete this file if you're not using it
import "./src/global.css"

if (!Intl.PluralRules) {
  import("./src/polyfill/pluralRules")
}

if (!Intl.RelativeTimeFormat) {
  import("./src/polyfill/relativeTimeFormat")
}
