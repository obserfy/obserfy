import React, { FC } from "react"

import { LocalizedLink as Link } from "gatsby-theme-i18n"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import { Trans } from "@lingui/macro"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

const IndexPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex-row justify-center my-12 max-w-xl">
      <h1 className="text-5xl leading-none font-heading font-medium">
        <Trans>Run your Montessori school efficiently</Trans>
      </h1>
      <p className="text-xl my-8 text-gray-700 font-body">
        <Trans>We help Montessori schools manage their records, do reports and communicate with parents efficiently</Trans>
      </p>
      <div className="sm:flex">
        <a
          href="https://app.obserfy.com/register"
          className="block mb-3 sm:mb-0 sm:mr-3"
        >
          <Button
            className="w-full sm:w-auto text-lg"
            onClick={() => {
              trackCustomEvent({
                category: "Get Start Button",
                action: "Click",
                label: "Get Start",
              })
            }}
          >
            <Trans>Get Early Access</Trans>
          </Button>
        </a>
        <Link to="/contact">
          <Button secondary className="w-full sm:w-auto text-lg bg-green-200">
            <Trans>Contact Us</Trans>
          </Button>
        </Link>
      </div>
    </div>
  </Layout>
)

export default IndexPage
