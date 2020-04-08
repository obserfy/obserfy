import { QueryResult, useQuery } from "react-query"
import { getSchoolId } from "../hooks/schoolIdState"
import { fetchApi } from "./fetchApi"

interface Guardians {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetGuardians = (): QueryResult<Guardians[]> => {
  const schoolId = getSchoolId()
  const fetchObservation = fetchApi<Guardians[]>(
    `/schools/${schoolId}/guardians`
  )
  return useQuery(["guardians", { schoolId }], fetchObservation)
}
