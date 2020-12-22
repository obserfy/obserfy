import { useQuery } from "react-query"
import { getSchoolId } from "../schoolIdState"
import { useQueryCache } from "../useQueryCache"
import { getApi } from "./fetchApi"

const KEY = (schoolId: string) => ["school", schoolId, "curriculum"]

interface GetCurriculumResponse {
  id: string
  name: string
}
export function useGetCurriculum() {
  const schoolId = getSchoolId()
  const getCurriculum = getApi<GetCurriculumResponse>(
    `/schools/${schoolId}/curriculums`
  )
  return useQuery(KEY(schoolId), getCurriculum, {
    retry: (a, b) => {
      return (b as Error).message !== "School doesn't have curriculum yet"
    },
  })
}

export const useGetCurriculumCache = () => {
  return useQueryCache<GetCurriculumResponse>(KEY(getSchoolId()))
}
