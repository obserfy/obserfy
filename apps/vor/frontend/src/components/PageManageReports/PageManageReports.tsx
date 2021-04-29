import { t } from "@lingui/macro"
import React, { FC } from "react"
import { borderBottom } from "../../border"
import { ALL_REPORT_URL } from "../../routes"
import TopBar, { breadCrumb } from "../TopBar/TopBar"
import TranslucentBar from "../TranslucentBar/TranslucentBar"

export interface PageManageReportsProps {
  reportId: string
}

const PageManageReports: FC<PageManageReportsProps> = () => {
  return (
    <div>
      <TranslucentBar boxSx={{ ...borderBottom }}>
        <TopBar
          breadcrumbs={[
            breadCrumb(t`All Reports`, ALL_REPORT_URL),
            breadCrumb("Report Title"),
          ]}
        />
      </TranslucentBar>
    </div>
  )
}

export default PageManageReports
