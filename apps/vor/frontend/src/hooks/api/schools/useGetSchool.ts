import { useQuery } from "react-query"
import { getApi } from "../fetchApi"
import { getSchoolId } from "../../schoolIdState"

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
  const fetchSchool = getApi<GetSchoolResponse>(`/schools/${getSchoolId()}`)
  return useQuery("school", fetchSchool)
}
