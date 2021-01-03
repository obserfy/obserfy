import { graphql, useStaticQuery } from "gatsby"
import React, { FC } from "react"
import { PaymentSuccessQuery } from "../../../graphql-types"

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

  return <div />
}

export default PagePaymentSuccess
