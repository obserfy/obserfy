import useApi from "./useApi"

export interface Student {
  id: string
  name: string
}
export const useGetStudents = (
  schoolId: string
): [Student[], boolean, () => void] => {
  const [students, isLoading, setAsOutdated] = useApi<Student[]>(
    `/schools/${schoolId}/students`
  )
  return [students ?? [], isLoading, setAsOutdated]
}
