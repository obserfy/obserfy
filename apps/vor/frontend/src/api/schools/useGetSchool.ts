import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "../fetchApi"
import { getSchoolId } from "../../hooks/schoolIdState"

interface School {
  name: string
  inviteLink: string
  users: {
    id: string
    name: string
    email: string
    isCurrentUser: boolean
  }[]
}
export const useGetSchool = (): QueryResult<School> => {
  const fetchSchool = fetchApi<School>(`/schools/${getSchoolId()}`)
  return useQuery("school", fetchSchool)
}
