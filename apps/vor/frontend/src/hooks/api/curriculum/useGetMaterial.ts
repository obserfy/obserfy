import { useQuery } from "react-query"
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

export default useGetMaterial
