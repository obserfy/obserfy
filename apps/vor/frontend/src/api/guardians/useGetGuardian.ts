import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "../fetchApi"

interface Guardian {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetGuardian = (guardianId: string): QueryResult<Guardian> => {
  const fetchGuardian = fetchApi<Guardian>(`/guardians/${guardianId}`)
  return useQuery(["guardian", { guardianId }], fetchGuardian)
}
