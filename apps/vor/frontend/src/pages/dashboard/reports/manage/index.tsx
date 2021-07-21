import { t } from "@lingui/macro"
import { FC } from "react"
import { Box, Flex, Text } from "theme-ui"
import { borderBottom } from "../../../../border"
import { Link } from "../../../../components/Link/Link"
import SEO from "../../../../components/seo"
import TopBar, { breadCrumb } from "../../../../components/TopBar/TopBar"
import TranslucentBar from "../../../../components/TranslucentBar/TranslucentBar"
import useGetReport from "../../../../hooks/api/reports/useGetProgressReport"
import { useGetAllStudents } from "../../../../hooks/api/students/useGetAllStudents"
import { useQueryString } from "../../../../hooks/useQueryString"
import { ALL_REPORT_URL, STUDENT_REPORT_URL } from "../../../../routes"

const ManageReports = () => {
  const reportId = useQueryString("reportId")
  const studentId = useQueryString("studentId")
  const report = useGetReport(reportId)
  const students = useGetAllStudents("", true)

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

      {students.data?.map(({ id, name }) => (
        <Student
          key={id}
          reportId={reportId}
          studentId={id}
          studentId1={studentId}
          name={name}
        />
      ))}
    </Box>
  )
}

const Student: FC<{
  reportId: string
  studentId: string
  studentId1: string
  name: string
}> = ({ name, reportId, studentId, studentId1 }) => (
  <Link
    to={STUDENT_REPORT_URL(reportId, studentId)}
    sx={{
      width: "100%",
      backgroundColor: studentId1 === studentId ? "primaryLighter" : "",
      display: "flex",
      alignItems: "center",
      ...borderBottom,
      "&:hover": {
        backgroundColor: "primaryLightest",
      },
    }}
  >
    <Text mr="auto" p={3} className="truncate" sx={{ fontSize: 1 }}>
      {name}
    </Text>

    <Text mr={3} sx={{ fontSize: 0 }} color="textMediumEmphasis">
      Joyful 1
    </Text>
  </Link>
)

export default ManageReports
