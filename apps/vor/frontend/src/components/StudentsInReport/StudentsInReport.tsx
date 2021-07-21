import { FC } from "react"
import { Box, Text, ThemeUIStyleObject } from "theme-ui"
import { borderBottom } from "../../border"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { STUDENT_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"

export interface PageManageReportsProps {
  reportId: string
  studentId: string
  containerSx?: ThemeUIStyleObject
}

const StudentsInReport: FC<PageManageReportsProps> = ({
  reportId,
  studentId,
}) => {
  const students = useGetAllStudents("", true)

  return (
    <Box>
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
    <Text p={3} className="truncate" sx={{ fontSize: 1 }}>
      {name}
    </Text>

    <Box>
      <Text sx={{ fontSize: 1 }}>Joyful 1</Text>
    </Box>
  </Link>
)

export default StudentsInReport
