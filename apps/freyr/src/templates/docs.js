import React from "react"
import Header from "../components/Header"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { t, Trans } from "@lingui/macro"
import { Link } from "../components/Link"
import Footer from "../components/Footer"

const Docs = ({ data }) => (
  <div className="min-h-screen">
    <Header />

    <div className="max-w-7xl mx-auto relative">
      <div className="flex px-3">
        <div className={"w-60 prose prose-sm"}>
          <h3>
            <Trans>Documentations</Trans>
          </h3>
          <SidebarHeader text={t`Quickstart`} />
          <SidebarEntry text={t`Introductions`} to={"/docs"}/>
          <SidebarEntry text={t`Inviting your team`} />
          <SidebarEntry text={t`Giving access to parents`} />

          <SidebarHeader text={t`Observations`} />
          <SidebarEntry text={t`Writing observations`} />
          <SidebarEntry text={t`Sharing with parents`} />

          <SidebarHeader text={t`Lesson Plans`} />
          <SidebarEntry text={t`Creating Lesson plan`} />
          <SidebarEntry text={t`Repetitions`} />
          <SidebarEntry text={t`Sharing with parents`} />

          <SidebarHeader text={t`Billing`} />

          <SidebarHeader text={t`Open source`} />
          <SidebarEntry text={t`Open source by default`} />
          <SidebarEntry text={t`Contributing`} />
        </div>

        <main className="prose px-5">
          <MDXRenderer>{data.mdx.body}</MDXRenderer>
        </main>
      </div>
    </div>

    <Footer />
  </div>
)

const SidebarHeader = ({ text }) => (
  <h4>
    <Trans id={text} />
  </h4>
)

const SidebarEntry = ({ text, to = "/" }) => (
  <Link to={to} className="no-underline hover:underline block border-l pl-3">
    <h5>{text}</h5>
  </Link>
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
