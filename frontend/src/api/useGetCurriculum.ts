import { getSchoolId } from "../hooks/schoolIdState"
import useApi, { Api } from "./useApi"

interface GetCurriculumResponse {
  name: string
}
export function useGetCurriculum(): Api<GetCurriculumResponse> {
  return useApi<GetCurriculumResponse>(`/schools/${getSchoolId()}/curriculum`)
}
