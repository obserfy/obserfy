import React from "react"
import PageManageReports from "../../../../../components/PageManageReports/PageManageReports"
import PageStudentReport from "../../../../../components/PageStudentReport/PageStudentReport"
import SEO from "../../../../../components/seo"
import { useQueryString } from "../../../../../hooks/useQueryString"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="Progress Reports" />
      <PageManageReports reportId={reportId}>
        <PageStudentReport studentId={studentId} />
      </PageManageReports>
    </>
  )
}

export default ManageReports
