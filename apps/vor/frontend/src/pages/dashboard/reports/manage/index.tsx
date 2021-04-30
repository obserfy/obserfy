import React from "react"
import PageManageReports from "../../../../components/PageManageReports/PageManageReports"
import SEO from "../../../../components/seo"
import { useQueryString } from "../../../../hooks/useQueryString"

const ManageReports = () => {
  const reportId = useQueryString("reportId")

  return (
    <>
      <SEO title="Progress Reports" />
      <PageManageReports reportId={reportId} />
    </>
  )
}

export default ManageReports
