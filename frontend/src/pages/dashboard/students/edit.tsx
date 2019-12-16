import React, { FC, useContext } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import PageEditStudent from "../../../components/PageEditStudent/PageEditStudent"
import SEO from "../../../components/seo"
import { PageTitleContext } from "../../../layouts"

const EditStudent: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  const pageTitle = useContext(PageTitleContext)
  pageTitle.setTitle("Edit Student")

  return (
    <>
      <SEO title="Edit Student" />
      <PageEditStudent id={id} />
    </>
  )
}
export default EditStudent
