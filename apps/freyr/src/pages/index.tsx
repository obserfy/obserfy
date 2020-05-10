import React, { FC } from "react"

import { Link } from "gatsby"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const IndexPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex-row justify-center my-16 max-w-xl">
      <h1 className="text-5xl mb-4 leading-none font-heading font-medium">
        Efficient Record Keeping for Montessori Schools
      </h1>
      <p className="text-xl my-8 text-gray-700 font-body">
        Record, manage and analyze your student observations collaboratively.
        Plan future lessons, compile reports, in one platform.
      </p>
      <div className="sm:flex">
        <a
          href="https://app.obserfy.com/register"
          className="block mb-3 sm:mb-0 sm:mr-3"
        >
          <Button className="w-full sm:w-auto text-lg" onClick={() => {
              trackCustomEvent({
                category: "Get Start Button",
                action: "Click",
                label: "Get Start",
              })
            }
          }>Get Started</Button>
        </a>
        <Link to="/contact-us">
          <Button secondary className="w-full sm:w-auto text-lg bg-green-200">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </Layout>
)

export default IndexPage
