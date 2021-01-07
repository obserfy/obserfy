import React from "react"
import { MDXRenderer } from "gatsby-plugin-mdx"
import { t, Trans } from "@lingui/macro"
import { Link } from "../components/Link"
import SEO from "../components/seo"
import DocsHeader from "../components/DocsHeader"
import Logo from "../images/logo-standalone.svg"
import DocsFooter from "../components/DocsFooter"

const Docs = ({ data }) => (
  <div className="min-h-screen bg-white">
    <SEO
      title={data.mdx.frontmatter.title}
      description={data.mdx.frontmatter.description}
    />

    <div className="flex">
      <Sidebar />

      <div className={"w-full"}>
        <DocsHeader />

        <main className="prose p-6 pb-16">
          <MDXRenderer>{data.mdx.body}</MDXRenderer>
        </main>
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
    <div className="flex items-center py-6">
      <Link to="/" className="flex items-center hover:underline">
        <img src={Logo} className="w-6" alt="logo" />
        <h1 className="text-lg ml-2 font-bold font-body">Obserfy</h1>
      </Link>
      <h1 className="text-lg ml-2 font-bold font-body">/</h1>
      <Link to="/docs" className="flex items-center hover:underline">
        <h1 className="text-lg ml-2 font-body">Docs</h1>
      </Link>
    </div>

    <div className={"prose prose-sm "}>
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
  </div>
)

const SidebarHeader = ({ text }) => (
  <h4>
    <Trans id={text} />
  </h4>
)

const SidebarEntry = ({ text, to = "/docs/coming-soon" }) => (
  <Link
    to={to}
    className="no-underline hover:underline block border-l pl-3 py-1"
  >
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
