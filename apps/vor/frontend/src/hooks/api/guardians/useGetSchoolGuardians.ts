import { queryCache, QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { getApi } from "../fetchApi"

export interface Guardians {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetSchoolGuardians = (): QueryResult<Guardians[]> => {
  const schoolId = getSchoolId()
  const fetchGuardians = getApi<Guardians[]>(`/schools/${schoolId}/guardians`)
  return useQuery(["guardians", { schoolId }], fetchGuardians)
}

export const getSchoolGuardiansCache = () => {
  const schoolId = getSchoolId()
  return queryCache.getQueryData<Guardians[]>(["guardians", { schoolId }])
}

export const setSchoolGuardiansCache = (guardians: Guardians[]) => {
  const schoolId = getSchoolId()
  return queryCache.setQueryData<Guardians[]>(
    ["guardians", { schoolId }],
    guardians
  )
}
