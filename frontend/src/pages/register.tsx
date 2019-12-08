import React, { FC } from "react"
import queryString from "query-string"
import { PageRendererProps } from "gatsby"
import PageRegister from "../components/PageRegister/PageRegister"

export const Register: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let inviteCode: string
  if (Array.isArray(query?.inviteCode)) {
    inviteCode = query?.inviteCode[0] ?? ""
  } else {
    inviteCode = query?.inviteCode ?? ""
  }

  return <PageRegister inviteCode={inviteCode} />
}

export default Register
