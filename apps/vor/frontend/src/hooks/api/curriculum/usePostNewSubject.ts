import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { useGetAreaSubjectsCache } from "../useGetAreaSubjects"

interface PostNewSubjectRequestBody {
  name: string
}
const usePostNewSubject = (areaId: string) => {
  const subjectsCache = useGetAreaSubjectsCache(areaId)
  const postNewSubject = postApi<PostNewSubjectRequestBody>(
    `/curriculums/areas/${areaId}/subjects`
  )
  return useMutation(postNewSubject, {
    onSuccess: async () => {
      await subjectsCache.refetchQueries()
    },
  })
}

export default usePostNewSubject
