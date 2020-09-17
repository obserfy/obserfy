import { useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { getApi } from "./fetchApi"

interface GetCurriculumResponse {
  id: string
  name: string
}
export function useGetCurriculum() {
  const schoolId = getSchoolId()
  const getCurriculum = getApi<GetCurriculumResponse>(
    `/schools/${schoolId}/curriculums`
  )
  return useQuery(["school", schoolId, "curriculum"], getCurriculum, {
    retry: (a, b) => {
      return b.message !== "School doesn't have curriculum yet"
    },
  })
}
