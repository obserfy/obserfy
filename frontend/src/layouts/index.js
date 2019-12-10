import React from "react"
import Layout from "../components/Layout/Layout"

const LayoutManager = ({ children, pageContext }) => {
  if (pageContext.layout === "open") {
    return children
  }
  return <Layout pageTitle="Home">{children}</Layout>
}

export default LayoutManager
