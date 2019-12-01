import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useQueryStudentDetails = (
  id: string
): [Student | undefined, () => void] => {
  const [students, setAsOutdated] = useApi<Student>(`/students/${id}`)
  return [students, setAsOutdated]
}
