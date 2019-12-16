import React, { FC, useContext } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import PageStudentDetails from "../../../components/PageStudentDetails/PageStudentDetails"
import SEO from "../../../components/seo"
import { PageTitleContext } from "../../../layouts"

const StudentDetails: FC<PageRendererProps> = ({ location }) => {
  const query = queryString.parse(location.search)
  let id: string
  if (Array.isArray(query?.id)) {
    id = query?.id[0] ?? ""
  } else {
    id = query?.id ?? ""
  }

  const pageTitle = useContext(PageTitleContext)
  pageTitle.setTitle("Student Details")

  return (
    <>
      <SEO title="Student Details" />
      <PageStudentDetails id={id} />
    </>
  )
}
export default StudentDetails
