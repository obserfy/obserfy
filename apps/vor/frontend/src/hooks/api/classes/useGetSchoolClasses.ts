import { useQuery } from "react-query"
import { getApi } from "../fetchApi"
import { getSchoolId } from "../../schoolIdState"

export interface Class {
  id: string
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const useGetSchoolClasses = () => {
  const schoolId = getSchoolId()
  const getClass = getApi<Class[]>(`/schools/${schoolId}/classes`)
  return useQuery(["classes", schoolId], getClass)
}

export default useGetSchoolClasses
