import { t } from "@lingui/macro"
import { borderBottom } from "../../../../../border"
import PageStudentReport from "../../../../../components/PageStudentReport/PageStudentReport"
import SEO from "../../../../../components/seo"
import TopBar, { breadCrumb } from "../../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../../components/TranslucentBar/TranslucentBar"
import { getFirstName } from "../../../../../domain/person"
import useGetReport from "../../../../../hooks/api/reports/useGetProgressReport"
import { useGetStudent } from "../../../../../hooks/api/useGetStudent"
import { useQueryString } from "../../../../../hooks/useQueryString"
import { ALL_REPORT_URL, MANAGE_REPORT_URL } from "../../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")
  const report = useGetReport(reportId)
  const student = useGetStudent(studentId)

  return (
    <>
      <SEO title={`${student.data?.name} | Progress Report`} />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title, MANAGE_REPORT_URL(reportId)),
            breadCrumb(getFirstName(student.data)),
          ]}
        />
      </TranslucentBar>

      <PageStudentReport studentId={studentId} />
    </>
  )
}

export default ManageReports
