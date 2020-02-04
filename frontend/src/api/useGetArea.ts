import useApi, { Api } from "./useApi"

export interface Area {
  id: string
  name: string
}
export function useGetArea(areaId: string): Api<Area> {
  return useApi<Area>(`/curriculum/areas/${areaId}`)
}
