import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useQueryAllStudents = (
  schoolId: string
): [Student[], () => void] => {
  const [students, setAsOutdated] = useApi<Student[]>(
    `/schools/${schoolId}/students`
  )
  return [students ?? [], setAsOutdated]
}
