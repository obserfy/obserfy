import React, { FC } from "react"

import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"
import { trackCustomEvent } from "gatsby-plugin-google-analytics"

const ContactUsPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex-row lg:flex my-16">
      <div className="flex-row justify-center lg:w-1/2">
        <h1 className="text-5xl mb-4 leading-none font-heading font-medium">
          Contact Us
        </h1>
        <p className="text-xl my-8 text-gray-700 font-body">
          Record, manage and analyze your student observations collaboratively.
          Plan future lessons, compile reports, in one platform.
        </p>
        <div className="sm:flex mb-16">
          <a
            href="https://app.obserfy.com/register"
            className="block mb-3 sm:mb-0 sm:mr-3"
          >
            <Button secondary className="w-full sm:w-auto text-lg bg-green-200" onClick={() => {
                trackCustomEvent({
                  category: "Get Start Button",
                  action: "Click",
                  label: "Get Start",
                })
              }
            }>Get Started</Button>
          </a>
        </div>
      </div>
      <div className="flex-row justify-center lg:w-1/3 mx-auto md:mx-32">
        <form className="bg-white shadow-md rounded p-8" name="contact" method="POST" data-netlify="true">
          <div className="py-4">
            <input type="text" id="email" name="email" placeholder="Email" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required={true} />
          </div>
          <div className="py-4">
            <textarea name="message" placeholder="Message" className="resize-none border rounded shadow w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" required={true} />
          </div>
          <div className="py-4">
            <Button className="w-full text-lg" type="submit">Send</Button>
          </div>
        </form>
      </div>
    </div>
  </Layout>
)

export default ContactUsPage
