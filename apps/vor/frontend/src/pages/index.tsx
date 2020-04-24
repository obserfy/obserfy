import { PageRendererProps } from "gatsby"
import React, { FC } from "react"
import { navigate } from "../components/Link/Link"

const IndexPage: FC<PageRendererProps> = ({ location }) => {
  if (typeof window !== "undefined" && location.pathname === "/") {
    navigate("/dashboard/observe")
  }
  return <div />
}

export default IndexPage
