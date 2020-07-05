import React, { FC } from "react"
import PageStudentPlanDetails from "../../../../../components/PageStudentPlanDetails/PageStudentPlanDetails"
import { useQueryString } from "../../../../../hooks/useQueryString"
import SEO from "../../../../../components/seo"

const NewPlans: FC = () => {
  const studentId = useQueryString("studentId")
  const planId = useQueryString("planId")

  return (
    <>
      <SEO title="New Lesson Plans" />
      <PageStudentPlanDetails studentId={studentId} planId={planId} />
    </>
  )
}

export default NewPlans
