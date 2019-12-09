import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import PageEditStudent from "../../components/PageEditStudent/PageEditStudent"
import Layout from "../../components/Layout/Layout"
import SEO from "../../components/seo"

const EditStudent: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  return (
    <Layout pageTitle="Edit student">
      <SEO title="Edit Student" />
      <PageEditStudent id={id} />
    </Layout>
  )
}
export default EditStudent
