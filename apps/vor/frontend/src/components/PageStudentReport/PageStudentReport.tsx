import React, { FC } from "react"
import { Box } from "theme-ui"
import { useGetStudent } from "../../hooks/api/useGetStudent"

export interface PageStudentReportProps {
  studentId: string
}
const PageStudentReport: FC<PageStudentReportProps> = ({ studentId }) => {
  const student = useGetStudent(studentId)

  return <Box p={3}>{student.data?.name}</Box>
}

export default PageStudentReport
