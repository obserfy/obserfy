import { queryCache, useMutation } from "react-query"
import { postFile } from "../../apiHelpers"

const usePostImage = (studentId, schoolId: string) => {
  const postImage = postFile(
    `/image?schoolId=${schoolId}&studentId=${studentId}`
  )
  return useMutation(postImage, {
    onSuccess: async () => queryCache.invalidateQueries(["childPlans"]),
  })
}

export default usePostImage
