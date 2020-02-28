import React, { FC, useContext } from "react"
import { PageRendererProps } from "gatsby"
import SEO from "../../../components/seo"
import { PageTitleContext } from "../../../layouts"
import PageNewStudent from "../../../components/PageNewStudent/PageNewStudent"
import { useTitle } from "../../../hooks/useTitle"

const NewStudent: FC<PageRendererProps> = () => {
  useContext(PageTitleContext).setTitle("New Student")
  useTitle("New Student")

  return (
    <>
      <SEO title="Edit Student" />
      <PageNewStudent />
    </>
  )
}
export default NewStudent
