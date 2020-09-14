import React, { FC } from "react"
import SEO from "../../../../components/seo"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageEditObservation from "../../../../components/PageEditObservation/PageEditObservation"

const NewObservation: FC = () => {
  const studentId = useQueryString("studentId")
  const observationId = useQueryString("observationId")

  return (
    <>
      <SEO title="Edit Student" />
      <PageEditObservation
        studentId={studentId}
        observationId={observationId}
      />
    </>
  )
}
export default NewObservation
