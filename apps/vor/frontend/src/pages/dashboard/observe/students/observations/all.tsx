import React, { FC } from "react"
import SEO from "../../../../../components/seo"
import PageAllObservations from "../../../../../components/PageAllObservations/PageAllObservations"
import { useQueryString } from "../../../../../hooks/useQueryString"

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
