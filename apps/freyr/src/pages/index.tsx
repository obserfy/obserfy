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
    <div className="px-3 flex-row justify-center my-12">
      <div className="prose prose-lg md:prose-lg mb-32 mt-20 max-w-xl">
        <h1 className="text-4xl md:text-5xl">
          <Trans>Run your Montessori School efficiently</Trans>
        </h1>
        <p className="my-8 text-gray-700 font-body">
          <Trans>
            <GreenBold>Store</GreenBold> your student data and observations.{" "}
            <GreenBold>Plan</GreenBold> their lessons. And{" "}
            <GreenBold>share</GreenBold> your data with parents with ease, on
            one platform built for the need of Montessori Schools.
          </Trans>
        </p>
        <div className="sm:flex">
          <a
            href="https://app.obserfy.com/register"
            className="block mb-3 sm:mb-0 sm:mr-3"
          >
            <Button className="w-full sm:w-auto ">
              <Trans>Try for Free</Trans>
            </Button>
          </a>
          <Link to="/contact">
            <Button secondary className="w-full sm:w-auto ">
              <Trans>Contact Us</Trans>
            </Button>
          </Link>
        </div>
      </div>

      <p className="font-bold text-lg text-green-700 mb-5">
        <Trans>Digital record keeping</Trans>
      </p>
      <div className="prose prose-lg pr-6 max-w-xl pb-20">
        <h2>
          <Trans>Helping teachers to be more productive</Trans>
        </h2>
        <p>
          <Trans>
            Managing student records using paper and spreadsheets can be messy.
            Data can sometimes slip through the cracks.
          </Trans>
        </p>
        <p>
          <Trans>
            We help simplify teacher&apos;s work by providing{" "}
            <GreenBold>
              one simple place for you to keep your student records
            </GreenBold>{" "}
            so that your data are accessible for all teachers, and easily
            shareable to parents.
          </Trans>
        </p>
        <Button className="py-2 px-3 text-base">
          <Trans>Learn More</Trans>
        </Button>
      </div>

      <div className="prose md:flex justify-between max-w-full">
        <div className="w-full pr-6">
          <h3>
            <Trans>Record Observations</Trans>
          </h3>
          <p>
            <Trans>
              We help you keep your student observation in one place, so its
              available to every teachers, anytime, anywhere.
            </Trans>
          </p>
        </div>

        <div className="w-full pr-6">
          <h3>
            <Trans>Plan student&apos;s lesson</Trans>
          </h3>
          <p>
            <Trans>
              Plan your student&apos;s lesson ahead of time, and share them with
              other teachers, and even with parents.
            </Trans>
          </p>
        </div>

        <div className="w-full pr-6">
          <h3>
            <Trans>Track student&apos;s curriculum progress</Trans>
          </h3>
          <p>
            <Trans>
              Easily keep track of your student&apos;s progress through your
              curriculum in one place, making building reports easier.
            </Trans>
          </p>
        </div>

        <div className="w-full">
          <h3>
            <Trans>Built with speed and simplicity in mind</Trans>
          </h3>
          <p>
            <Trans>
              We focus on keeping Obserfy fast to help you get your job done
              faster, and easy to use even if you are new to Montessori.
            </Trans>
          </p>
        </div>
      </div>

      <p className="font-bold text-lg text-green-700 mb-5 pt-20">
        <Trans>Parent communication</Trans>
      </p>
      <div className="prose prose-lg pr-6 max-w-xl">
        <h2>
          <Trans>
            Tools to build more transparent and collaborative schools
          </Trans>
        </h2>
        <p>
          <Trans>
            Collaboration between parents and schools are important, especially
            in the post-COVID 19 world. We help you empower parents by providing
            custom dashboard for them to access,{" "}
            <GreenBold>
              making it easy to share your data and collaborate with parents on
              their child&apos;s education.
            </GreenBold>
          </Trans>
        </p>
        <Button className="py-2 px-3 text-base">
          <Trans>Learn More</Trans>
        </Button>
      </div>

      <div className="prose md:flex justify-between max-w-full">
        <div className="w-full pr-6">
          <h3>
            <Trans>Share curriculum progress with parents</Trans>
          </h3>
          <p>
            <Trans>
              Let parents see and keep track of their child&apos;s progress
              through through your school&apos;s curriculum.
            </Trans>
          </p>
        </div>

        <div className="w-full pr-6">
          <h3>
            <Trans>Share lesson plans</Trans>
          </h3>
          <p>
            <Trans>
              Share lesson plans/tasks that parents can execute at home, along
              with some resources to guide them.
            </Trans>
          </p>
        </div>

        <div className="w-full pr-6">
          <h3>
            <Trans>Collaborate on Observations</Trans>
          </h3>
          <p>
            <Trans>
              Allow parents to post observations at home about their
              children&apos;s task, and see observations that teachers had
              created.
            </Trans>
          </p>
        </div>

        <div className="w-full">
          <h3>
            <Trans>Share photos</Trans>
          </h3>
          <p>
            <Trans>
              Easily share photos of your students with their parents, and allow
              parents to post photos of their children doing tasks assigned to
              them outside of school.
            </Trans>
          </p>
        </div>
      </div>
    </div>
  </Layout>
)

const GreenBold: FC = ({ children }) => (
  <b className="text-green-700">{children}</b>
)

export default IndexPage
