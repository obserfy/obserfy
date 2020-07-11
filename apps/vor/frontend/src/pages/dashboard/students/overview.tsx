import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import PageStudentOverview from "../../../components/PageStudentOverview/PageStudentOverview"
import SEO from "../../../components/seo"

const StudentOverview: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  return (
    <>
      <SEO title="Student Overview" />
      <PageStudentOverview id={id} />
    </>
  )
}
export default StudentOverview
