import { useQuery } from "react-query"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

interface GetMaterialResponse {
  id: string
  name: string
  description: string
}
const useGetMaterial = (id: string) => {
  const getMaterial = getApi<GetMaterialResponse>(
    `/curriculums/materials/${id}`
  )
  return useQuery(["material", id], getMaterial)
}

export const useGetMaterialCache = (id: string) => {
  return useQueryCache(["material", id])
}

export default useGetMaterial
