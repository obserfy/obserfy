import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import PageStudentOverview from "../../../components/PageStudentOverview/PageStudentOverview"
import SEO from "../../../components/seo"
import { useQueryString } from "../../../hooks/useQueryString"

const StudentOverview: FC<PageRendererProps> = () => {
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="Student Overview" />
      <PageStudentOverview id={studentId} />
    </>
  )
}
export default StudentOverview
