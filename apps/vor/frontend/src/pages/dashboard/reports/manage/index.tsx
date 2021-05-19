import { t } from "@lingui/macro"
import React from "react"
import { borderBottom } from "../../../../border"
import StudentsInReport from "../../../../components/StudentsInReport/StudentsInReport"
import SEO from "../../../../components/seo"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import useGetReport from "../../../../hooks/api/reports/useGetProgressReport"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ALL_REPORT_URL } from "../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")
  const report = useGetReport(reportId)

  return (
    <>
      <SEO title="Progress Reports" />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          breadcrumbs={[
            breadCrumb(t`All Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />
      </TranslucentBar>

      <StudentsInReport reportId={reportId} studentId={studentId} />
    </>
  )
}

export default ManageReports
