import { QueryOptions, QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

export interface Area {
  id: string
  name: string
}
export function useGetArea(
  areaId: string,
  options?: QueryOptions<Area>
): QueryResult<Area> {
  const fetchArea = fetchApi<Area>(`/curriculums/areas/${areaId}`)
  return useQuery(["areas", areaId], fetchArea, options)
}
