import React, { FC } from "react"
import SEO from "../../../../../components/seo"
import PageAllObservations from "../../../../../components/PageAllObservations/PageAllObservations"
import { useQueryString } from "../../../../../hooks/useQueryString"

export const ALL_OBSERVATIONS_PAGE_URL = (studentId: string): string =>
  `/dashboard/observe/students/observations/all?studentId=${studentId}`

const AllObservations: FC = () => {
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="All Observations" />
      <PageAllObservations studentId={studentId} />
    </>
  )
}

export default AllObservations
