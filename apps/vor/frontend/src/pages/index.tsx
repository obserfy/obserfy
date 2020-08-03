import { PageRendererProps } from "gatsby"
import React, { FC, useEffect } from "react"
import { navigate } from "../components/Link/Link"
import { STUDENTS_URL } from "../routes"

const IndexPage: FC<PageRendererProps> = () => {
  useEffect(() => {
    navigate(STUDENTS_URL)
  }, [])
  return <div />
}

export default IndexPage
