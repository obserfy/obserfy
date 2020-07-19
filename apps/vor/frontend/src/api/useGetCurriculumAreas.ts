import { QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"
import { getApi } from "./fetchApi"

export function useGetCurriculumAreas(): QueryResult<Area[]> {
  const fetchCurriculumAreas = getApi<Area[]>(
    `/schools/${getSchoolId()}/curriculums/areas`
  )
  return useQuery("areas", fetchCurriculumAreas)
}
