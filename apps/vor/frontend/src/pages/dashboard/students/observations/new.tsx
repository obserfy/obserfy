import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageNewObservation from "../../../../components/PageNewObservation/PageNewObservation"
import { useQueryString } from "../../../../hooks/useQueryString"

const NewObservation: FC = () => {
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="Edit Student" />
      <PageNewObservation studentId={studentId} />
    </>
  )
}
export default NewObservation
