import { t, Trans } from "@lingui/macro"
import React, { FC } from "react"
import Layout from "../components/layout"
import Button from "../components/Button/Button"
import SEO from "../components/seo"

const PricingPage: FC = () => {
  return (
    <Layout>
      <SEO
        title={t`Pricing`}
        description={t`Simple and affordable user based pricing`}
      />
      <div className="max-w-2xl mx-auto">
        <div className="sm:flex">
          <div className="prose sm:mt-5 mt-16 mb-16 mx-3">
            <h1 className="text-4xl sm:text-5xl text-center sm:text-left">
              <Trans>Simple affordable pricing</Trans>
            </h1>
          </div>

          <div className="p-3">
            <div className="rounded-2xl prose bg-white mx-auto border shadow sm:w-80  border-primary">
              <h4 className="text-center my-6">
                <Trans>Standard plan</Trans>
              </h4>
              <h2 className="mr-1 m-0 text-center mb-8">
                <Trans>$4 per User/month</Trans>
              </h2>
              <p className="m-3 text-center">
                <Trans>Unlimited students</Trans>
              </p>
              <p className="m-3 text-center">
                <Trans>Record observations</Trans>
              </p>
              <p className="m-3 text-center">
                <Trans>Create lesson plans</Trans>
              </p>
              <p className="m-3 text-center">
                <Trans>Track curriculum progress</Trans>
              </p>
              <p className="m-3 text-center">
                <Trans>Parent dashboard</Trans>
              </p>
              <p className="m-3 text-center">
                <Trans>Image gallery</Trans>
              </p>
              <a
                className="px-3 pt-3 mb-1 block"
                href="https://app.obserfy.com/register"
              >
                <Button className="w-full">
                  <Trans>Try for Free</Trans>
                </Button>
              </a>
              <p className="m-0 mb-1 text-center prose-sm">
                <Trans>Free 30-day trial</Trans>
              </p>
            </div>
          </div>
        </div>

        <div className="m-3 mt-8 prose prose-lg">
          <h2>
            <Trans>FAQ</Trans>
          </h2>
          <h3>
            <Trans>Who counts as a User?</Trans>
          </h3>
          <p>
            <Trans>
              A user is anyone with their own login access to the school&apos;s
              dashboard, such as teachers and teaching assistants.
            </Trans>
          </p>

          <h3>
            <Trans>How many student/parents can we have?</Trans>
          </h3>
          <p>
            <Trans>
              We don&apos;t charge or limit the number of students or parents
              that you work with.
            </Trans>
          </p>
          <p>
            <Trans>
              You can track as many students as you want and share access to the
              parent dashboard to as many people as you need without increasing
              the cost.
            </Trans>
          </p>
        </div>
      </div>
    </Layout>
  )
}

export default PricingPage
