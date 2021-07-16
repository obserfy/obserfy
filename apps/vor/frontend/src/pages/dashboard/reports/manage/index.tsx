import { t } from "@lingui/macro"

import { borderBottom } from "../../../../border"
import SEO from "../../../../components/seo"
import StudentsInReport from "../../../../components/StudentsInReport/StudentsInReport"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import Typography from "../../../../components/Typography/Typography"
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

      <TranslucentBar boxSx={{ ...borderBottom, minHeight: 146 }}>
        <TopBar
          containerSx={{ ...borderBottom }}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />
        <Typography.H6 p={3} pb={0}>
          {report.data?.title}
        </Typography.H6>
        <Typography.Body p={3} color="textMediumEmphasis">
          {report.data?.periodStart.format("DD MMMM YYYY")} -{" "}
          {report.data?.periodStart.format("DD MMMM YYYY")}
        </Typography.Body>
      </TranslucentBar>

      <StudentsInReport reportId={reportId} studentId={studentId} />
    </>
  )
}

export default ManageReports
