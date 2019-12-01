import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useStudentNames = (): [Student[], () => void] => {
  const [names, setAsOutdated] = useApi<Student[]>("/students")
  return [names ?? [], setAsOutdated]
}
