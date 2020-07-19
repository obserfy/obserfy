import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import queryString from "query-string"
import SEO from "../../../components/seo"
import PageStudentProgress from "../../../components/PageStudentProgress/PageStudentProgress"

function getQueryAsString(query: string, key: string): string {
  const parsedQuery = queryString.parse(query)
  const value = parsedQuery[key]
  if (!value) return ""
  if (Array.isArray(value)) return value[0]
  return value
}

const StudentProgress: FC<PageRendererProps> = ({ location }) => {
  const studentId = getQueryAsString(location.search, "studentId")
  const areaId = getQueryAsString(location.search, "areaId")

  return (
    <>
      <SEO title="Student Details" />
      <PageStudentProgress studentId={studentId} areaId={areaId} />
    </>
  )
}
export default StudentProgress
