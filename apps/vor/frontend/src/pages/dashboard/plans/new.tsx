import React, { FC } from "react"
import SEO from "../../../components/seo"
import PageNewPlan from "../../../components/PageNewPlan/PageNewPlan"
import { useQueryString } from "../../../hooks/useQueryString"

const NewPlans: FC = () => {
  const date = useQueryString("date")

  return (
    <>
      <SEO title="New Lesson Plans" />
      <PageNewPlan chosenDate={date} />
    </>
  )
}

export default NewPlans
