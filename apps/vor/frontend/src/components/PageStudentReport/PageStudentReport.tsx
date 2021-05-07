import React, { FC } from "react"
import { useGetStudent } from "../../hooks/api/useGetStudent"

export interface PageStudentReportProps {
  studentId: string
}
const PageStudentReport: FC<PageStudentReportProps> = ({ studentId }) => {
  const student = useGetStudent(studentId)

  return <div>{student.data?.name}</div>
}

export default PageStudentReport
