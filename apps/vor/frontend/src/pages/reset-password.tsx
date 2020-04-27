import React, { FC } from "react"
import queryString from "query-string"
import { PageRendererProps } from "gatsby"
import SEO from "../components/seo"
import PageResetPassword from "../components/PageResetPassword/PageResetPassword"

export const ResetPassword: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)

  let token: string
  if (Array.isArray(query?.token)) {
    token = query?.token[0] ?? ""
  } else {
    token = query?.token ?? ""
  }

  return (
    <>
      <SEO title="Reset Password" />
      <PageResetPassword token={token} />
    </>
  )
}

export default ResetPassword
