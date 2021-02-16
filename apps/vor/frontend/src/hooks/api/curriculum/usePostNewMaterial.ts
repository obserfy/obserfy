import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import { useGetSubjectMaterialsCache } from "../useGetSubjectMaterials"

interface PostNewMaterialRequestBody {
  name: string
  description?: string
}
const usePostNewMaterial = (subjectId: string) => {
  const cache = useGetSubjectMaterialsCache(subjectId)
  const postNewMaterial = postApi<PostNewMaterialRequestBody>(
    `/curriculums/subjects/${subjectId}/materials`
  )
  return useMutation(postNewMaterial, {
    onSuccess: async () => {
      await cache.refetchQueries()
    },
  })
}

export default usePostNewMaterial
