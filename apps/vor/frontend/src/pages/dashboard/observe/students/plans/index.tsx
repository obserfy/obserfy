import React from "react"
import PageStudentPlans from "../../../../../components/PageStudentPlans/PageStudentPlans"
import { useQueryString } from "../../../../../hooks/useQueryString"

const StudentPlans = () => {
  const studentId = useQueryString("studentId")
  const date = useQueryString("date")

  return <PageStudentPlans studentId={studentId} date={date} />
}

export default StudentPlans
