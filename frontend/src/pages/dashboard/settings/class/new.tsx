import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageNewClass from "../../../../components/PageNewClass/PageNewClass"

export const NEW_CLASS_URL = "/dashboard/settings/class/new"

const NewClass: FC = () => {
  return (
    <>
      <SEO title="Class" />
      <PageNewClass />
    </>
  )
}

export default NewClass
