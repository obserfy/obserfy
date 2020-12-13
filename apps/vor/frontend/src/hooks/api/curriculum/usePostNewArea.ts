import { useMutation } from "react-query"
import { postApi } from "../fetchApi"
import {
  getCurriculumAreasCache,
  setCurriculumAreasCache,
} from "../useGetCurriculumAreas"

interface PostNewAreaRequestBody {
  name: string
}
const usePostNewArea = (curriculumId: string) => {
  const postNewArea = postApi<PostNewAreaRequestBody>(
    `/curriculums/${curriculumId}/areas`
  )

  return useMutation(postNewArea, {
    onSuccess: async (data) => {
      analytics.track("Area Created")
      if (data) {
        const newArea = await data.json()
        const cache = getCurriculumAreasCache() ?? []
        cache.push(newArea)
        setCurriculumAreasCache(cache)
      }
    },
  })
}

export default usePostNewArea
