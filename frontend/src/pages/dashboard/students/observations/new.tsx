import React, { FC, useContext } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import SEO from "../../../../components/seo"
import { PageTitleContext } from "../../../../layouts"
import PageNewObservation from "../../../../components/PageNewObservation/PageNewObservation"

const NewStudent: FC<PageRendererProps> = ({ location }) => {
  useContext(PageTitleContext).setTitle("New Observation")

  const query = queryString.parse(location.search)
  let studentId: string
  if (Array.isArray(query?.studentId)) {
    studentId = query?.studentId[0] ?? ""
  } else {
    studentId = query?.studentId ?? ""
  }

  return (
    <>
      <SEO title="Edit Student" />
      <PageNewObservation studentId={studentId} />
    </>
  )
}
export default NewStudent
