import { PageRendererProps } from "gatsby"
import React, { FC } from "react"
import { navigate } from "../components/Link/Link"
import { STUDENTS_URL } from "../routes"

const IndexPage: FC<PageRendererProps> = ({ location }) => {
  if (typeof window !== "undefined" && location.pathname === "/") {
    navigate(STUDENTS_URL)
  }
  return <div />
}

export default IndexPage
