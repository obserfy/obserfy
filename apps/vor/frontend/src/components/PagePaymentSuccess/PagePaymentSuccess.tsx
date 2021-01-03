import { graphql, useStaticQuery } from "gatsby"
import React, { FC } from "react"
import { Box } from "theme-ui"
import { PaymentSuccessQuery } from "../../../graphql-types"
import { ADMIN_SUBSCRIPTION_URL, ADMIN_URL } from "../../routes"
import TopBar, { breadCrumb } from "../TopBar/TopBar"

export interface PagePaymentSuccessProps {}

const PagePaymentSuccess: FC<PagePaymentSuccessProps> = () => {
  useStaticQuery<PaymentSuccessQuery>(graphql`
    query PaymentSuccess {
      file(relativePath: { eq: "success.png" }) {
        childImageSharp {
          fluid(maxWidth: 200) {
            ...GatsbyImageSharpFluid_withWebp
          }
        }
      }
    }
  `)

  return (
    <Box mx="auto" sx={{ maxWidth: "maxWidth.xsm" }}>
      <TopBar
        breadcrumbs={[
          breadCrumb("Admin", ADMIN_URL),
          breadCrumb("Subscription", ADMIN_SUBSCRIPTION_URL),
          breadCrumb("Success"),
        ]}
      />
    </Box>
  )
}

export default PagePaymentSuccess
