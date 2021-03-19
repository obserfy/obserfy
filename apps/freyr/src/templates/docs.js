import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { MDXProvider } from "@mdx-js/react"
import SEO from "../components/seo"
import DocsHeader from "../components/DocsHeader"
import DocsFooter from "../components/DocsFooter"
import DocsSidebar from "../components/DocsSidebar"
import DocsLogo from "../components/DocsLogo"
import TopDecoration from "../images/top-bg.svg"
import { graphql } from "gatsby"

const Docs = ({ data }) => (
  <div className="min-h-screen bg-white">
    <SEO
      title={data.mdx.frontmatter.title}
      description={data.mdx.frontmatter.description}
    />
    <img
      alt="decoration"
      src={TopDecoration}
      className="absolute top-0 left-0 right-0 -z-50 w-screen opacity-30"
    />

    <div className="flex">
      <Sidebar />

      <div className={"w-full"}>
        <DocsHeader />

        <div className={"p-6 pb-16 max-w-7xl mx-auto"}>
          <main className="prose">
            <MDXProvider>
              <MDXRenderer>{data.mdx.body}</MDXRenderer>
            </MDXProvider>
          </main>
        </div>
      </div>
    </div>

    <DocsFooter />
  </div>
)

const Sidebar = () => (
  <div
    className={
      "hidden md:block w-60 sticky top-0 max-h-screen pl-6 z-10 bg-white border-r overflow-y-auto w-80"
    }
  >
    <div className="pb-6 pt-5">
      <DocsLogo />
    </div>

    <DocsSidebar />
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
        description
      }
      body
    }
  }
`
