import { PageRendererProps, navigate } from "gatsby"
import React, { FC, useEffect } from "react"
import { STUDENTS_URL } from "../routes"

const IndexPage: FC<PageRendererProps> = () => {
  // TODO: replace with gatsby's newly exported Redirect component when it lands
  //  (gatsby #26046)
  useEffect(() => {
    navigate(STUDENTS_URL)
  }, [])
  return <div />
}

export default IndexPage
