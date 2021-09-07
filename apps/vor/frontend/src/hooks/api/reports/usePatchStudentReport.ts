import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetStudentReportCache } from "./useGetStudentReport"

interface PatchStudentReport {
  ready?: boolean
  generalComments?: string
}

const usePatchStudentReport = (reportId: string, studentId: string) => {
  const cache = useGetStudentReportCache(reportId, studentId)

  const patchStudentReport = patchApi<PatchStudentReport>(
    `/progress-reports/${reportId}/students/${studentId}`
  )

  return useMutation(patchStudentReport, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePatchStudentReport
