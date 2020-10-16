/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.onCreatePage = ({ graphql, page, actions }) => {
  const { createPage } = actions

  if (
    !page.path.startsWith("/dashboard") &&
    !page.path.startsWith("/" + page.context.locale + "/dashboard")
  ) {
    // eslint-disable-next-line no-param-reassign
    page.context.layout = "open"
    createPage(page)
  }
}
