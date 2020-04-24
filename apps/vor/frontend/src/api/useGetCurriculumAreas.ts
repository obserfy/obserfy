import { QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { Area } from "./useGetArea"
import { fetchApi } from "./fetchApi"

export function useGetCurriculumAreas(): QueryResult<Area[]> {
  const fetchCurriculumAreas = fetchApi<Area[]>(
    `/schools/${getSchoolId()}/curriculum/areas`
  )
  return useQuery("areas", fetchCurriculumAreas)
}
