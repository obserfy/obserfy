/** @jsx jsx */
import { FC } from "react"
import { jsx, Image, Box, ThemeUIStyleObject } from "theme-ui"
import { borderRight } from "../../border"
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
            "&:hover": {
              backgroundColor: "primaryLightest",
            },
          }}
        >
          <Box p={3} className="truncate">
            {name}
          </Box>

          <Image
            src="/icons/chevron-right-white.svg"
            alt=""
            ml="auto"
            mr={3}
            sx={{ opacity: 0.4 }}
          />
        </Link>
      ))}
    </Box>
  )
}

export default StudentsInReport
