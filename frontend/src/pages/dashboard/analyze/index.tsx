import React, { FC } from "react"
import SEO from "../../../components/seo"
import PageAnalyze from "../../../components/PageAnalyze/PageAnalyze"

const IndexPage: FC = () => {
  return (
    <>
      <SEO title="Home" />
      <PageAnalyze />
    </>
  )
}

export default IndexPage
