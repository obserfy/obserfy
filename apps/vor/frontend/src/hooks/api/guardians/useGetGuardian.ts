import { useQuery } from "react-query"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

const KEY = (guardianId: string) => ["guardians", guardianId]

interface Guardian {
  id: string
  name: string
  email: string
  note: string
  phone: string
  address: string
  children: Array<{
    id: string
    name: string
  }>
}
export const useGetGuardian = (guardianId: string) => {
  const fetchGuardian = getApi<Guardian>(`/guardians/${guardianId}`)
  return useQuery(KEY(guardianId), fetchGuardian)
}

export const useGetGuardianCache = (guardianId: string) => {
  return useQueryCache<Guardian>(KEY(guardianId))
}
