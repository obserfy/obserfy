/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */
exports.onInitialClientRender = () => {
  setTimeout(() => {
    const t = "script"
    const BASE_URL = "https://app.chatwoot.com"
    const g = document.createElement(t)
    const s = document.getElementsByTagName(t)[0]
    g.src = BASE_URL + "/packs/js/sdk.js"
    g.async = true
    s.parentNode.insertBefore(g, s)
    g.onload = function() {
      window.chatwootSDK.run({
        websiteToken: "3WWc83LrsFhSEfXiNQLnVtku",
        baseUrl: BASE_URL,
      })
    }
  }, 2000)
}