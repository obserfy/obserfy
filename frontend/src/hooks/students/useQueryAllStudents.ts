import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useQueryAllStudents = (
  schoolId: string
): [Student[], () => void, boolean] => {
  const [students, setAsOutdated, isLoading] = useApi<Student[]>(
    `/schools/${schoolId}/students`
  )
  return [students ?? [], setAsOutdated, isLoading]
}
