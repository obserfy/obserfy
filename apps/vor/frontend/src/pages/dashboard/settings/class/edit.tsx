import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageEditClass from "../../../../components/PageEditClass/PageEditClass"
import { useQueryString } from "../../../../hooks/useQueryString"

const EditClass: FC = () => {
  const classId = useQueryString("classId")

  return (
    <>
      <SEO title="Edit Class" />
      <PageEditClass classId={classId} />
    </>
  )
}

export default EditClass
