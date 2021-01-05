import React from "react"
import Header from "../components/Header"
import { MDXRenderer } from "gatsby-plugin-mdx"

const Docs = ({ data }) => (
  <div className="max-w-7xl mx-auto relative">
    <Header />

    <ul className={"flex"}>
      <li>Intro</li>
      <li>Tutorials</li>
      <li>Billing</li>
    </ul>

    <main className="prose px-5">
      <MDXRenderer>{data.mdx.body}</MDXRenderer>
    </main>
  </div>
)

export default Docs

export const query = graphql`
  query($locale: String!, $slug: String!) {
    mdx(
      fields: { locale: { eq: $locale } }
      frontmatter: { slug: { eq: $slug } }
    ) {
      frontmatter {
        slug
        title
      }
      body
    }
  }
`
