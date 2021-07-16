import { t } from "@lingui/macro"
import { FC } from "react"
import PageLogin from "../components/PageLogin/PageLogin"
import SEO from "../components/seo"

export const Login: FC = () => (
  <>
    <SEO title={t`Login`} description={t`Manage your student data`} />
    <PageLogin />
  </>
)

export default Login
