import { useQuery } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const KEY = (schoolId: string) => ["guardians", { schoolId }]
export interface Guardians {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetSchoolGuardians = () => {
  const schoolId = getSchoolId()
  const fetchGuardians = getApi<Guardians[]>(`/schools/${schoolId}/guardians`)
  return useQuery(KEY(schoolId), fetchGuardians)
}

export const useGetSchoolGuardiansCache = () => {
  return useQueryCache<Guardians[]>(getSchoolId())
}
