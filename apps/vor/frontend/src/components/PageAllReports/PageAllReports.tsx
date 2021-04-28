import React, { FC } from "react"
import { Box } from "theme-ui"
import { ProgressReport } from "../../__generated__/models"
import useGetReports from "../../hooks/api/useGetReports"
import EmptyPlaceholder from "./EmptyPlaceholder"
import ReportLists from "./ReportList"

export interface PageAllReportsProps {}

const PageAllReports: FC<PageAllReportsProps> = () => {
  const reports = useGetReports()

  if (reports.isLoading) return <div>Loading</div>

  if (reports.isSuccess) return <Success reports={reports.data} />

  return <Box p={3}>Error</Box>
}

const Success: FC<{ reports: ProgressReport[] }> = ({ reports }) => {
  if (reports.length < 0) return <EmptyPlaceholder />

  return <ReportLists reports={reports} />
}

export default PageAllReports
