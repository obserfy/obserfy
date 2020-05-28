import React, { FC } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import Button from "../components/button"

const ContactUsPage: FC = () => (
  <Layout>
    <SEO title="Home" />
    <div className="flex-row sm:flex my-16">
      <div className="flex-row justify-center lg:w-1/2 mr-3">
        <h1 className="text-5xl mb-4 leading-none font-heading font-medium">
          Contact Us
        </h1>
        <p className="text-xl mt-8 mb-3 text-gray-700 font-body">
          Have a question? Shoot us a message using this form. We&apos;d love to
          talk with you about your need.
        </p>
      </div>
      <div className="flex-row justify-center lg:w-1/3 ml-auto">
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          className="pt-3 md:pt-16"
        >
          <label htmlFor="email" className="text-gray-700">
            Email
            <input
              type="email"
              id="email"
              name="email"
              placeholder="stephen@gmail.com"
              className="shadow appearance-none border rounded w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3"
              required
            />
          </label>
          <label htmlFor="message" className="text-gray-700">
            Message
            <textarea
              name="message"
              className="resize-none text-lg border rounded shadow w-full p-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-3 h-48"
              required
            />
          </label>
          <Button className="w-full text-lg" type="submit">
            Send
          </Button>
        </form>
      </div>
    </div>
  </Layout>
)

export default ContactUsPage
