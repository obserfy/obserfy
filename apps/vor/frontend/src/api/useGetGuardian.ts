import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"

interface Guardians {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetGuardian = (guardianId: string): QueryResult<Guardians> => {
  const fetchGuardian = fetchApi<Guardians>(`/guardians/${guardianId}`)
  return useQuery(["guardian", { guardianId }], fetchGuardian)
}
