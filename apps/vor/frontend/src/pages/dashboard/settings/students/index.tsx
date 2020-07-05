import React, { FC } from "react"
import SEO from "../../../../components/seo"
import PageListOfStudents from "../../../../components/PageListOfStudents/PageListOfStudents"

const Class: FC = () => {
  return (
    <>
      <SEO title="Students" />
      <PageListOfStudents />
    </>
  )
}

export default Class
