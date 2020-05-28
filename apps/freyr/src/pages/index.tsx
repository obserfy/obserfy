import React, { FC } from "react"

import { Link } from "gatsby"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

const IndexPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex-row justify-center my-12 max-w-xl">
      <h1 className="text-5xl leading-none font-heading font-medium">
        Run your Montessori school efficiently
      </h1>
      <p className="text-xl my-8 text-gray-700 font-body">
        We help Montessori schools manage their records, do reports and
        communicate with parents efficiently
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
            Get Early Access
          </Button>
        </a>
        <Link to="/contact">
          <Button secondary className="w-full sm:w-auto text-lg bg-green-200">
            Contact Us
          </Button>
        </Link>
      </div>
    </div>
  </Layout>
)

export default IndexPage
