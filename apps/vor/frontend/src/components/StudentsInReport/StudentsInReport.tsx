/** @jsx jsx */
import { FC } from "react"
import { jsx, Box, ThemeUIStyleObject } from "theme-ui"
import { borderRight } from "../../border"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { STUDENT_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import Typography from "../Typography/Typography"
import { ReactComponent as ChevronRight } from "../../icons/chevron-right.svg"

export interface PageManageReportsProps {
  reportId: string
  studentId: string
  containerSx?: ThemeUIStyleObject
}

const StudentsInReport: FC<PageManageReportsProps> = ({
  reportId,
  studentId,
  containerSx,
}) => {
  const students = useGetAllStudents("", true)

  return (
    <Box
      sx={{
        ...containerSx,
        ...borderRight,
        width: "100%",
        maxWidth: [undefined, undefined, undefined, undefined, 340],
        height: "100vh",
        position: "sticky",
        top: 0,
        overflowY: "auto",
        pb: 48,
      }}
    >
      {students.data?.map(({ id, name }) => (
        <Link
          key={id}
          to={STUDENT_REPORT_URL(reportId, id)}
          sx={{
            backgroundColor: studentId === id ? "primaryLighter" : "",
            display: "flex",
            alignItems: "center",
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
        >
          <Typography.Body p={3} className="truncate">
            {name}
          </Typography.Body>

          <ChevronRight
            sx={{
              ml: "auto",
              mr: 3,
              opacity: 0.4,
            }}
          />
        </Link>
      ))}
    </Box>
  )
}

export default StudentsInReport
