import React from "react"
import { Helmet } from "react-helmet"
import PageSubscription from "../../../../components/PageSubscription/PageSubscription"

const SubscriptionPage = () => {
  return (
    <>
      <Helmet>
        <link href="https://cdn.paddle.com/paddle/paddle.js" rel="prefetch" />
      </Helmet>
      <PageSubscription />
    </>
  )
}

export default SubscriptionPage
