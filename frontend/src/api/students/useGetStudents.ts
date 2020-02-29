import useApi, { Api } from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useGetStudents = (schoolId: string): Api<Student[]> => {
  const url = `/schools/${schoolId}/students`
  const api = useApi<Student[]>(url)
  // Disabled coz this creates extremely weird rerender
  // const cachedStudents = useStudentsCache(schoolId, api?.data)

  return { ...api, data: api?.data ?? [] }
}
