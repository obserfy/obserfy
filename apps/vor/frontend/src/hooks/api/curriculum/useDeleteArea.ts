import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { deleteApi } from "../fetchApi"
import { useGetCurriculumAreasCache } from "../useGetCurriculumAreas"

const useDeleteArea = (areaId: string) => {
  const cache = useGetCurriculumAreasCache()
  const deleteArea = deleteApi(`/curriculums/areas/${areaId}`)
  return useMutation(deleteArea, {
    onSuccess: () => {
      track("Area Deleted")
      const old = cache.getData()
      if (old) {
        cache.setData(old.filter(({ id }) => id !== areaId))
      }
    },
  })
}

export default useDeleteArea
