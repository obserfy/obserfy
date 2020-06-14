import { QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { fetchApi } from "../fetchApi"

export interface Guardians {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetSchoolGuardians = (): QueryResult<Guardians[]> => {
  const schoolId = getSchoolId()
  const fetchGuardians = fetchApi<Guardians[]>(`/schools/${schoolId}/guardians`)
  return useQuery(["guardians", { schoolId }], fetchGuardians)
}
