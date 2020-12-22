import { t } from "@lingui/macro"
import React, { FC } from "react"
import PageLogin from "../components/PageLogin/PageLogin"
import SEO from "../components/seo"

export const Login: FC = () => (
  <>
    <SEO
      title={t`Login for Teachers`}
      description={t`Manage your student data`}
    />
    <PageLogin />
  </>
)

export default Login
