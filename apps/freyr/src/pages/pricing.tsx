import React, { FC } from "react"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { ReactComponent as CheckmarkIcon } from "../images/checkmark-outline.svg"
import { Trans } from "@lingui/macro"

const PricingPage: FC = () => (
  <Layout>
    <SEO title="Pricing" />
    <div className="text-center mx-auto">
      <h1 className="text-5xl font-medium my-12"><Trans>Best price for You</Trans></h1>
      <div className="flex-row justify-center sm:flex">
        <PricingCard />
        <PricingCard />
      </div>
    </div>
  </Layout>
)

const PricingCard: FC<{}> = ({}) => (
  <div className="m-4 shadow p-6 rounded-md">
    <div className="text-left mx-auto">
      <h2 className="text-base font-semibold">Standard Plan</h2>
      <div className="mb-1">
        <span className="text-5xl font-medium">$11.99</span>
        <span className="text-sm text-gray-600"> User/month</span>
      </div>
      <p className="mb-6">Simple pricing for every school.</p>
      <div>
        <div className="inline">
          <div className="text-primary"><CheckmarkIcon /></div>
          <span>90-days free trial</span>
        </div>
        <div>Unlimited students</div>
        <div>Record observations</div>
        <div>Create lesson plans</div>
        <div>Track curriculum progress</div>
        <div>Parent portal</div>
      </div>
    </div>
  </div>
)

export default PricingPage