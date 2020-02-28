import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import SEO from "../../../../components/seo"
import PageNewObservation from "../../../../components/PageNewObservation/PageNewObservation"
import { useTitle } from "../../../../hooks/useTitle"

const NewStudent: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let studentId: string
  if (Array.isArray(query?.studentId)) {
    studentId = query?.studentId[0] ?? ""
  } else {
    studentId = query?.studentId ?? ""
  }

  useTitle("New Observation")

  return (
    <>
      <SEO title="Edit Student" />
      <PageNewObservation studentId={studentId} />
    </>
  )
}
export default NewStudent
