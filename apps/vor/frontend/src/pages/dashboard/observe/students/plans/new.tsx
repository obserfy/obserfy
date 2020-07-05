import React, { FC } from "react"
import { useQueryString } from "../../../../../hooks/useQueryString"
import SEO from "../../../../../components/seo"
import PageNewStudentPlans from "../../../../../components/PageNewStudentPlans/PageNewStudentPlans"

const NewStudentPlans: FC = () => {
  const date = useQueryString("date")
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="New Lesson Plans" />
      <PageNewStudentPlans chosenDate={date} studentId={studentId} />
    </>
  )
}

export default NewStudentPlans
