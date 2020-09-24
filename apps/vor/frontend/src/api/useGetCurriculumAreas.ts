import { queryCache, QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"
import { getApi } from "./fetchApi"

export function useGetCurriculumAreas(): QueryResult<Area[]> {
  const schoolId = getSchoolId()
  const fetchCurriculumAreas = getApi<Area[]>(
    `/schools/${getSchoolId()}/curriculums/areas`
  )
  return useQuery(["areas", schoolId], fetchCurriculumAreas)
}

export const invalidateGetCurriculumAreasCache = () => {
  const schoolId = getSchoolId()
  return queryCache.invalidateQueries(["areas", schoolId])
}

export const getCurriculumAreasCache = () => {
  return queryCache.getQueryData<Area[]>(["areas", getSchoolId()])
}

export const setCurriculumAreasCache = (areas: Area[]) => {
  return queryCache.setQueryData(["areas", getSchoolId()], areas)
}
