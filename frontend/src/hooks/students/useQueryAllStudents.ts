import useApi from "../../api/useApi"

export interface Student {
  id: string
  name: string
}
export const useQueryAllStudents = (
  schoolId: string
): [Student[], boolean, () => void] => {
  const [students, isLoading, setAsOutdated] = useApi<Student[]>(
    `/schools/${schoolId}/students`
  )
  return [students ?? [], isLoading, setAsOutdated]
}
