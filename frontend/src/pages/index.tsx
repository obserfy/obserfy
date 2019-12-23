import { PageRendererProps } from "gatsby"
import React, { FC } from "react"
import { navigate } from "gatsby-plugin-intl3"

const IndexPage: FC<PageRendererProps> = ({ location }) => {
  if (location.pathname === "/") {
    navigate("/dashboard/home")
  }
  return <div />
}

export default IndexPage
