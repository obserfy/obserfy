import React, { FC } from "react"
import SEO from "../components/seo"
import PageForgotPassword from "../components/PageForgotPassword/PageForgotPassword"

export const ForgotPassword: FC = () => (
  <>
    <SEO title="Forgot Password" />
    <PageForgotPassword />
  </>
)

export default ForgotPassword
