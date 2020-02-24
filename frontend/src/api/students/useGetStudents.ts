import useApi, { Api } from "../useApi"
import { useStudentsCache } from "./studentCache"

export interface Student {
  id: string
  name: string
}
export const useGetStudents = (schoolId: string): Api<Student[]> => {
  const url = `/schools/${schoolId}/students`
  const api = useApi<Student[]>(url)
  const cachedStudents = useStudentsCache(url, api?.data)

  return { ...api, data: api?.data ?? cachedStudents }
}
