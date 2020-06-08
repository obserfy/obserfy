import React, { FC } from "react"
import SEO from "../../../components/seo"
import { useQueryString } from "../../../hooks/useQueryString"
import PagePlanDetails from "../../../components/PagePlanDetails/PagePlanDetails"

const NewPlans: FC = () => {
  const id = useQueryString("id")

  return (
    <>
      <SEO title="New Lesson Plans" />
      <PagePlanDetails id={id} />
    </>
  )
}

export default NewPlans
