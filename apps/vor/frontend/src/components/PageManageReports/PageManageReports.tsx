import { t } from "@lingui/macro"
import React, { FC } from "react"
import { borderBottom } from "../../border"
import useGetReport from "../../hooks/api/reports/useGetProgressReport"
import { ALL_REPORT_URL } from "../../routes"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface PageManageReportsProps {
  reportId: string
}

const PageManageReports: FC<PageManageReportsProps> = ({ reportId }) => {
  const report = useGetReport(reportId)

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
    </div>
  )
}

export default PageManageReports
