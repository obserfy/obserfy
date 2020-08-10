import React from "react"
import { useQueryString } from "../../../../hooks/useQueryString"
import PageStudentImageDetails from "../../../../components/PageStudentImageDetails/PageStudentImageDetails"

const Details = () => {
  const studentId = useQueryString("studentId")
  const imageId = useQueryString("imageId")

  return <PageStudentImageDetails studentId={studentId} imageId={imageId} />
}

export default Details
