import React from "react"
import Header from "../components/Header"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { t, Trans } from "@lingui/macro"
import { Link } from "../components/Link"
import Footer from "../components/Footer"
import SEO from "../components/seo"

const Docs = ({ data }) => (
  <div className="min-h-screen bg-white">
    <SEO
      title={data.mdx.frontmatter.title}
      description={data.mdx.frontmatter.description}
    />
    <Header />

    <div className="max-w-7xl mx-auto relative">
      <div className="flex px-3">
        <div className={"w-60 prose prose-sm sticky top-0"}>
          <h3>
            <Trans>Documentations</Trans>
          </h3>
          <SidebarHeader text={t`Concepts`} />
          <SidebarEntry text={t`Introductions`} to={"/docs"} />

          <SidebarHeader text={t`School`} />
          <SidebarEntry text={t`Inviting your team`} />
          <SidebarEntry text={t`Giving parents access`} />
          <SidebarEntry text={t`Curriculum`} />
          <SidebarEntry text={t`Classes`} />
          <SidebarEntry text={t`Pricing & Billing`} />

          <SidebarHeader text={t`Students`} />
          <SidebarEntry text={t`Student profiles`} />
          <SidebarEntry text={t`Guardian profiles`} />
          <SidebarEntry text={t`Sharing data to guardians`} />

          <SidebarHeader text={t`Observations`} />
          <SidebarEntry text={t`Writing observations`} />
          <SidebarEntry text={t`Collaborating with parents`} />

          <SidebarHeader text={t`Lesson Plans`} />
          <SidebarEntry text={t`Creating Lesson plan`} />
          <SidebarEntry text={t`Repetitions`} />
          <SidebarEntry text={t`Sharing with parents`} />

          {/*<SidebarHeader text={t`Billing`} />*/}

          <SidebarHeader text={t`Support`} />
          <SidebarEntry text={t`Giving feedbacks`} />
          <SidebarEntry text={t`Contacting us`} />

          <SidebarHeader text={t`Open source`} />
          <SidebarEntry text={t`Open-source by default`} />
          <SidebarEntry text={t`Contributing`} />
          <SidebarEntry text={t`Self-hosting Obserfy`} />
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

const SidebarEntry = ({ text, to = "/docs/coming-soon" }) => (
  <Link to={to} className="no-underline hover:underline block border-l pl-3 py-1">
    <h5 className={"text-gray-700"}>{text}</h5>
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
        description
      }
      body
    }
  }
`
