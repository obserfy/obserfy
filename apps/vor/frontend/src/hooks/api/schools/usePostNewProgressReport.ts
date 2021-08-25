import { useMutation } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { postApi } from "../fetchApi"

interface PostNewReportBody {
  title: string
  periodStart: string
  periodEnd: string
  customizeStudents: boolean
  students: string[]
}

const usePostNewProgressReport = () => {
  const schoolId = getSchoolId()
  const postNewImage = postApi<PostNewReportBody>(
    `/schools/${schoolId}/progress-reports`
  )

  return useMutation(postNewImage)
}

export default usePostNewProgressReport
