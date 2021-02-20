import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { postApi } from "../fetchApi"
import { useGetCurriculumAreasCache } from "../useGetCurriculumAreas"

interface PostNewAreaRequestBody {
  name: string
}
const usePostNewArea = (curriculumId: string) => {
  const cache = useGetCurriculumAreasCache()
  const postNewArea = postApi<PostNewAreaRequestBody>(
    `/curriculums/${curriculumId}/areas`
  )

  return useMutation(postNewArea, {
    onSuccess: async (data) => {
      track("Area Created")
      if (data) {
        const newArea = await data.json()
        const old = cache.getData() ?? []
        old.push(newArea)
        cache.setData(old)
      }
    },
  })
}

export default usePostNewArea
