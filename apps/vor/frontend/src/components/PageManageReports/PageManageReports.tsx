import { t } from "@lingui/macro"
import React, { FC } from "react"
import { Box } from "theme-ui"
import { borderBottom, borderRight } from "../../border"
import useGetReport from "../../hooks/api/reports/useGetProgressReport"
import { useGetAllStudents } from "../../hooks/api/students/useGetAllStudents"
import { ALL_REPORT_URL, MANAGE_REPORT_URL } from "../../routes"
import { Link } from "../Link/Link"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface PageManageReportsProps {
  reportId: string
}

const PageManageReports: FC<PageManageReportsProps> = ({ reportId }) => {
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

      <Box py={2} sx={{ maxWidth: [undefined, 340], ...borderRight }}>
        {students.data?.map(({ id, name }) => (
          <Link to={MANAGE_REPORT_URL(reportId)}>
            <Box key={id} m={3} className="truncate">
              {name}
            </Box>
          </Link>
        ))}
      </Box>
    </div>
  )
}

export default PageManageReports
