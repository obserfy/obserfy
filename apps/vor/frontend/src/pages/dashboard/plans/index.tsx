import React, { FC } from "react"
import SEO from "../../../components/seo"
import PagePlans from "../../../components/PagePlans/PagePlans"
import { useQueryString } from "../../../hooks/useQueryString"

const Plans: FC = () => {
  const date = useQueryString("date")

  return (
    <>
      <SEO title="Lesson Plans" />
      <PagePlans date={date} />
    </>
  )
}

export default Plans
