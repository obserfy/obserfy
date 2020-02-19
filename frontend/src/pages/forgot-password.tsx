import React, { FC } from "react"
import SEO from "../components/seo"
import PageForgotPassword from "../components/PageForgotPassword/PageForgotPassword"

export const Login: FC = () => (
  <>
    <SEO title="Login" />
    <PageForgotPassword />
  </>
)

export default Login
