import { t } from "@lingui/macro"
import { FC } from "react"
import SEO from "../components/seo"
import PageForgotPassword from "../components/PageForgotPassword/PageForgotPassword"

export const ForgotPassword: FC = () => (
  <>
    <SEO title={t`Forgot Password`} />
    <PageForgotPassword />
  </>
)

export default ForgotPassword
