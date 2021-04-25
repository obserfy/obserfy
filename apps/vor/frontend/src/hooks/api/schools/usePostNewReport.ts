import { useMutation } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { postApi } from "../fetchApi"

interface PostNewReportBody {
  title: string
  periodStart: string
  periodEnd: string
}

const usePostNewReport = () => {
  const schoolId = getSchoolId()
  const postNewImage = postApi<PostNewReportBody>(
    `/schools/${schoolId}/reports`
  )

  return useMutation(postNewImage)
}

export default usePostNewReport
