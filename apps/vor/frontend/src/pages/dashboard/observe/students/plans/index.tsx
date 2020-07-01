import React from "react"
import PageStudentPlans from "../../../../../components/PageStudentPlans/PageStudentPlans"
import { useQueryString } from "../../../../../hooks/useQueryString"

const StudentPlans = () => {
  const studentId = useQueryString("studentId")

  return <PageStudentPlans studentId={studentId} />
}

export default StudentPlans
