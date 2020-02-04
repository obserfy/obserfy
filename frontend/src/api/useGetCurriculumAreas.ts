import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"
import useApi, { Api } from "./useApi"

export function useGetCurriculumAreas(): Api<Area[]> {
  return useApi<Area[]>(`/schools/${getSchoolId()}/curriculum/areas`)
}
