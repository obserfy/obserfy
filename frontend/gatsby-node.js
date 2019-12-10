/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using ita
exports.onCreatePage = ({ page, actions }) => {
  const { createPage } = actions

  if (
    page.path.startsWith("/login") ||
    page.path.startsWith("/register") ||
    page.path.startsWith("/choose-school") ||
    page.path.startsWith("/new-school")
  ) {
    // eslint-disable-next-line no-param-reassign
    page.context.layout = "open"
    createPage(page)
  }
}
