import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

export interface School {
  id: string
  name: string
}
export const useGetSchools = () => {
  const getSchools = getApi<School[]>("/users/schools")

  return useQuery(["schools"], getSchools)
}
