import React from "react"
import { Helmet } from "react-helmet"
import PageSubscription from "../../../../components/PageSubscription/PageSubscription"

const SubscriptionPage = () => {
  return (
    <>
      <Helmet>
        <link href="https://cdn.paddle.com/paddle/paddle.js" rel="prefetch" />
        <link
          href="https://checkoutshopper-live.adyen.com/checkoutshopper/sdk/3.9.0/adyen.js"
          rel="prefetch"
        />
        <link rel="preconnect" href="https://create-checkout.paddle.com" />
      </Helmet>
      <PageSubscription />
    </>
  )
}

export default SubscriptionPage
