import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Class {
  id: string
  name: string
  startTime: string
  endTime: string
  weekdays: number[]
}
const useGetClass = (classId: string) => {
  const getClass = getApi<Class>(`/classes/${classId}`)
  return useQuery(["class", classId], getClass)
}

export default useGetClass
