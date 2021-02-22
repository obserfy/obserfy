import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetMaterialCache } from "./useGetMaterial"

const usePatchMaterial = (id: string) => {
  const cache = useGetMaterialCache(id)
  const patchMaterial = patchApi(`/curriculums/materials/${id}`)
  return useMutation(patchMaterial, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePatchMaterial
