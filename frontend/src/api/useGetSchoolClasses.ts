import { QueryResult, useQuery } from "react-query"
import { fetchApi } from "./fetchApi"
import { getSchoolId } from "../hooks/schoolIdState"

interface Class {
  id: string
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const useGetSchoolClasses = (): QueryResult<Class[]> => {
  const schoolId = getSchoolId()
  const getClass = fetchApi<Class[]>(`/schools/${schoolId}/class`)
  return useQuery(["classes", schoolId], getClass)
}

export default useGetSchoolClasses
