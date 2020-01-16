import useApi from "../../api/useApi"

export interface Student {
  id: string
  name: string
  dateOfBirth: string
}
export const useQueryStudentDetails = (
  id: string
): [Student | undefined, boolean, () => void] => {
  return useApi<Student>(`/students/${id}`)
}
