import { findReportsByStudentId } from "$lib/db"
import { PageProps } from "$lib/next"
import Link from "next/link"
import { cache } from "react"

const fetchReports = cache(findReportsByStudentId)

export default async function Page(props: PageProps<"studentId">) {
  const reports = await fetchReports(props.params.studentId)

  return (
    <div>
      {reports.map((report) => {
        return (
          <Link
            key={report.id}
            href={`/${props.params.studentId}/reports/${report.id}`}
          >
            {report.title}
          </Link>
        )
      })}
    </div>
  )
}

export const metadata = {
  title: "Reports | Parents Dashboards - Obserfy",
}
