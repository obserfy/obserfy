import { QueryResult, useQuery } from "react-query"
import { getApi } from "../fetchApi"
import { getSchoolId } from "../../hooks/schoolIdState"

export interface GetSchoolResponse {
  name: string
  inviteLink: string
  users: {
    id: string
    name: string
    email: string
    isCurrentUser: boolean
  }[]
}
export const useGetSchool = (): QueryResult<GetSchoolResponse> => {
  const fetchSchool = getApi<GetSchoolResponse>(`/schools/${getSchoolId()}`)
  return useQuery("school", fetchSchool)
}
