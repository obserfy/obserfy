import useApi from "./useApi"
import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"

export function useGetCurriculumAreas(): [Area[], boolean, () => void] {
  const [area, loading, setOutdated] = useApi<Area[]>(
    `/schools/${getSchoolId()}/curriculum/areas`
  )
  return [area ?? [], loading, setOutdated]
}
