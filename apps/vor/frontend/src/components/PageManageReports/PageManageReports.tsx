/** @jsx jsx */
import { Trans } from "@lingui/macro"
import { FC } from "react"
import { jsx, Image, Box, ThemeUIStyleObject } from "theme-ui"
import { borderRight } from "../../border"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { STUDENT_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"

export interface PageManageReportsProps {
  reportId: string
  studentId: string
  containerSx?: ThemeUIStyleObject
}

const PageManageReports: FC<PageManageReportsProps> = ({
  reportId,
  studentId,
  containerSx,
}) => {
  const students = useGetAllStudents()

  return (
    <Box
      sx={{
        ...containerSx,
        ...borderRight,
        width: "100%",
        maxWidth: [undefined, 340],
      }}
    >
      <TranslucentBar boxSx={{ p: 3, pt: 4 }}>
        <Typography.H6>
          <Trans>Pick a Student</Trans>
        </Typography.H6>
      </TranslucentBar>

      {students.data?.map(({ id, name }) => (
        <Link
          key={id}
          to={STUDENT_REPORT_URL(reportId, id)}
          sx={{
            backgroundColor: studentId === id ? "primaryLightest" : "",
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

export default PageManageReports
