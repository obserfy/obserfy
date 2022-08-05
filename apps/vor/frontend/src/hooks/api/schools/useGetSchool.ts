import { useQuery } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { useQueryCache } from "../../useQueryCache"
import { getApi } from "../fetchApi"

export interface GetSchoolResponse {
  name: string
  inviteLink: string
  createdAt: string
  users: Array<{
    id: string
    name: string
    email: string
    isCurrentUser: boolean
  }>
  subscription: {
    id: string
    cancelUrl: string
    nextBillDate: string
    status: string
    updateUrl: string
  }
}
export const useGetSchool = () => {
  const schoolId = getSchoolId()
  const fetchSchool = getApi<GetSchoolResponse>(`/schools/${schoolId}`)

  return useQuery(["school", schoolId], fetchSchool)
}

export const useGetSchoolCache = (schoolId: string) => {
  return useQueryCache<GetSchoolResponse>(["school", schoolId])
}
