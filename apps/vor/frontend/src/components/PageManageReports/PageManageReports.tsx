/** @jsx jsx */
import { t, Trans } from "@lingui/macro"
import { FC } from "react"
import { jsx, Box, Flex } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import useGetReport from "../../hooks/api/reports/useGetProgressReport"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { ALL_REPORT_URL, MANAGE_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"
import { Typography } from "../Typography/Typography"

export interface PageManageReportsProps {
  reportId: string
}

const PageManageReports: FC<PageManageReportsProps> = ({
  reportId,
  children,
}) => {
  const report = useGetReport(reportId)
  const students = useGetAllStudents()

  return (
    <div>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          breadcrumbs={[
            breadCrumb(t`All Reports`, ALL_REPORT_URL),
            breadCrumb(report.data?.title),
          ]}
        />
      </TranslucentBar>

      <Flex>
        <Box sx={{ width: "100%", maxWidth: [undefined, 340], ...borderRight }}>
          <TranslucentBar boxSx={{ p: 3, pt: 4 }}>
            <Typography.H6>
              <Trans>Pick a Student</Trans>
            </Typography.H6>
          </TranslucentBar>
          {students.data?.map(({ id, name }) => (
            <Link key={id} to={MANAGE_REPORT_URL(reportId)}>
              <Box p={3} className="truncate">
                {name}
              </Box>
            </Link>
          ))}
        </Box>

        {children}
      </Flex>
    </div>
  )
}

export default PageManageReports
