import { useQuery } from "react-query"
import { getApi } from "./fetchApi"

export interface Area {
  id: string
  name: string
}
export function useGetArea(areaId: string) {
  const fetchArea = getApi<Area>(`/curriculums/areas/${areaId}`)

  return useQuery(["areas", areaId], fetchArea)
}
