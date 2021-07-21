import { t } from "@lingui/macro"
import { Box, Flex, Text } from "theme-ui"
import { borderBottom } from "../../../../border"
import SEO from "../../../../components/seo"
import StudentsInReport from "../../../../components/StudentsInReport/StudentsInReport"
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
    <Box sx={{ minHeight: "100vh" }}>
      <SEO title="Progress Reports" />

      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          containerSx={{ ...borderBottom }}
          breadcrumbs={[
            breadCrumb(t`Progress Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />

        <Flex>
          <Text p={3} pb={0} sx={{ fontSize: 1 }}>
            {report.data?.title}
          </Text>

          <Text p={3} color="textMediumEmphasis" sx={{ fontSize: 1 }}>
            {report.data?.periodStart.format("DD MMMM YYYY")} -{" "}
            {report.data?.periodStart.format("DD MMMM YYYY")}
          </Text>
        </Flex>
      </TranslucentBar>

      <StudentsInReport reportId={reportId} studentId={studentId} />
    </Box>
  )
}

export default ManageReports
