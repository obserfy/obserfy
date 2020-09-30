import React, { FC } from "react"
import { PageRendererProps } from "gatsby"
import SEO from "../../../../components/seo"
import PageStudentProfile from "../../../../components/PageStudentProfile/PageStudentProfile"
import { useQueryString } from "../../../../hooks/useQueryString"

const StudentProfile: FC<PageRendererProps> = () => {
  const studentId = useQueryString("studentId")

  return (
    <>
      <SEO title="Edit Student" />
      <PageStudentProfile studentId={studentId} />
    </>
  )
}

export default StudentProfile
