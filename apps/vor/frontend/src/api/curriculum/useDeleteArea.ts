import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import {
  getCurriculumAreasCache,
  setCurriculumAreasCache,
} from "../useGetCurriculumAreas"

const useDeleteArea = (areaId: string) => {
  const deleteArea = deleteApi(`/curriculums/areas/${areaId}`)
  return useMutation(deleteArea, {
    onSuccess: () => {
      const cache = getCurriculumAreasCache()
      if (cache) {
        setCurriculumAreasCache(cache.filter(({ id }) => id !== areaId))
      }
    },
  })
}

export default useDeleteArea
