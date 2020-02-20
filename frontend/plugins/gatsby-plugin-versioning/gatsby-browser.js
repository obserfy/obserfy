/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

export const onInitialClientRender = (_, pluginOptions) => {
  window[pluginOptions.variableName] = pluginOptions.value
}
