import { useQuery } from "react-query"
import { getSchoolId } from "../schoolIdState"
import { useQueryCache } from "../useQueryCache"
import { Area } from "./useGetArea"
import { getApi } from "./fetchApi"

const KEY = (schoolId: string) => ["areas", schoolId]

export function useGetCurriculumAreas() {
  const schoolId = getSchoolId()
  const fetchCurriculumAreas = getApi<Area[]>(
    `/schools/${schoolId}/curriculums/areas`
  )
  return useQuery(KEY(schoolId), fetchCurriculumAreas)
}

export const useGetCurriculumAreasCache = () => {
  return useQueryCache<Area[]>(KEY(getSchoolId()))
}
