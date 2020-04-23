import React, { FC } from "react"
import SEO from "../../../../../components/seo"
import PageNewSubject from "../../../../../components/PageNewSubject/PageNewSubject"
import { useQueryString } from "../../../../../hooks/useQueryString"

const NewSubjects: FC = () => {
  const areaId = useQueryString("areaId")

  return (
    <>
      <SEO title="New Material" />
      <PageNewSubject areaId={areaId} />
    </>
  )
}

export default NewSubjects
