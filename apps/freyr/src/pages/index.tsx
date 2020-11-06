import React, { FC } from "react"
import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { t, Trans } from "@lingui/macro"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

const IndexPage: FC = () => (
  <Layout>
    <SEO
      title={t`Record Keeping & Communication tool for Montessori Schools`}
    />
    <div className="px-3 flex-row justify-center my-12 max-w-xl ">
      <div className="prose prose-lg mb-32 mt-20">
        <h1>
          <Trans>Observe. Plan. Communicate.</Trans>
        </h1>
        <p className="my-8 text-gray-700 font-body">
          <Trans>
            Store your student data and observations. Plan their lessons. And
            communicate it all to parents with ease, using one platform built
            for the need of Montessori Schools.
          </Trans>
        </p>

        <div className="sm:flex">
          <a
            href="https://app.obserfy.com/register"
            className="block mb-3 sm:mb-0 sm:mr-3"
          >
            <Button className="w-full sm:w-auto ">
              <Trans>Get Early Access</Trans>
            </Button>
          </a>
          <Link to="/contact">
            <Button secondary className="w-full sm:w-auto ">
              <Trans>Contact Us</Trans>
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </Layout>
)

export default IndexPage
