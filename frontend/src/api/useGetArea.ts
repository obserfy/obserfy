import useApi from "./useApi"

export interface Area {
  id: string
  name: string
}
export function useGetArea(
  areaId: string
): [Area | undefined, boolean, () => void] {
  const [area, loading, setOutdated] = useApi<Area>(
    `/curriculum/areas/${areaId}`
  )
  return [area, loading, setOutdated]
}
