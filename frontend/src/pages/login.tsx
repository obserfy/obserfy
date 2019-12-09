import React, { FC } from "react"
import PageLogin from "../components/PageLogin/PageLogin"
import SEO from "../components/seo"

export const Login: FC = () => (
  <>
    <SEO title="Login" />
    <PageLogin />
  </>
)

export default Login
