/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it
exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions

  // Generate /help pages
  const helpTemplate = require.resolve(`./src/templates/docs.js`)
  const result = await graphql(`
    {
      help: allFile(filter: { sourceInstanceName: { eq: "docs" } }) {
        nodes {
          childMdx {
            frontmatter {
              slug
            }
          }
        }
      }
    }
  `)
  if (result.errors) {
    reporter.panicOnBuild(result.errors)
    return
  }
  const helpPosts = result.data.help.nodes
  helpPosts.forEach(({ childMdx: node }) => {
    createPage({
      path: "/docs" + node.frontmatter.slug,
      component: helpTemplate,
      context: {
        slug: node.frontmatter.slug,
      },
    })
  })
}