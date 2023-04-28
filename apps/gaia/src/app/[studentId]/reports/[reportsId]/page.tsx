import { findReportById } from "$lib/db"
import { PageProps } from "$lib/next"
import { cache } from "react"

const fetchReportById = cache(findReportById)

export default async function Reports(props: PageProps<"reportsId">) {
  const report = await fetchReportById(props.params.reportsId)

  if (!report) return "Report not found"

  return (
    <div className={"mx-auto max-w-7xl"}>
      <h1>{report.title}</h1>
    </div>
  )
}
