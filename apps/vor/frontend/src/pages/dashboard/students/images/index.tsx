import React from "react"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageStudentImages from "../../../../components/PageStudentImages/PageStudentImages"

const GalleryPage = () => {
  const studentId = useQueryString("studentId")
  return <PageStudentImages studentId={studentId} />
}

export default GalleryPage
