import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useQueryAllStudents = (): [Student[], () => void] => {
  const [students, setAsOutdated] = useApi<Student[]>("/students")
  return [students ?? [], setAsOutdated]
}
