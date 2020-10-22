import { useMutation } from "react-query"
import { postApi } from "../fetchApi"

interface PostNewRelatedStudentsRequestBody {
  studentIds: string[]
}
const usePostNewRelatedStudents = (planId: string) => {
  const postNewRelatedStudents = postApi<PostNewRelatedStudentsRequestBody>(
    `/plans/${planId}/students`
  )

  return useMutation(postNewRelatedStudents)
}

export default usePostNewRelatedStudents
