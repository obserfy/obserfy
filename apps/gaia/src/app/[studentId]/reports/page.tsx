import dayjs from "$lib/dayjs"
import { findReportsByStudentId } from "$lib/db"
import { PageProps } from "$lib/next"
import Link from "next/link"
import { cache } from "react"

const fetchReports = cache(findReportsByStudentId)

export default async function Page(props: PageProps<"studentId">) {
  const reports = await fetchReports(props.params.studentId)

  return (
    <div className={"mx-auto flex max-w-xl flex-col gap-4 px-4 pt-4"}>
      {reports.map((report) => {
        const startDate = dayjs(report.period_start).format("MMM YYYY")
        const endDate = dayjs(report.period_end).format("MMM YYYY")
        return (
          <Link
            key={report.id}
            href={`/${props.params.studentId}/reports/${report.id}`}
            className="block rounded-xl border border-gray-300 p-4 ring-primary-600 transition-all hover:ring-2"
          >
            <h3 className={"font-bold text-gray-800"}>{report.title}</h3>
            <p className={"text-gray-600"}>
              {startDate} - {endDate}
            </p>
          </Link>
        )
      })}
    </div>
  )
}

export const metadata = {
  title: "Reports | Parents Dashboards - Obserfy",
}
