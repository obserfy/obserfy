import React, { FC } from "react"
import SEO from "../../../../../components/seo"
import PageNewSubject from "../../../../../components/PageNewSubject/PageNewSubject"
import { useQueryString } from "../../../../../hooks/useQueryString"

export const NEW_SUBJECT_URL = (areaId: string): string =>
  `/dashboard/settings/curriculum/subjects/new?areaId=${areaId}`

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
