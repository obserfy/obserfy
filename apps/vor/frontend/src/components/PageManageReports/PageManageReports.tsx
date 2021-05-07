/** @jsx jsx */
import { Trans } from "@lingui/macro"
import { FC } from "react"
import { jsx, Box, ThemeUIStyleObject } from "theme-ui"
import { borderRight } from "../../border"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { STUDENT_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"

export interface PageManageReportsProps {
  reportId: string
  containerSx?: ThemeUIStyleObject
}

const PageManageReports: FC<PageManageReportsProps> = ({
  reportId,
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
        <Link key={id} to={STUDENT_REPORT_URL(reportId, id)}>
          <Box p={3} className="truncate">
            {name}
          </Box>
        </Link>
      ))}
    </Box>
  )
}

export default PageManageReports
