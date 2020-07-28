import { QueryResult, useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Guardian {
  id: string
  name: string
  email: string
  note: string
  phone: string
}
export const useGetGuardian = (guardianId: string): QueryResult<Guardian> => {
  const fetchGuardian = getApi<Guardian>(`/guardians/${guardianId}`)
  return useQuery(["guardians", { guardianId }], fetchGuardian)
}
