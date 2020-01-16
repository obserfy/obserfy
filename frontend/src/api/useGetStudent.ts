import useApi from "./useApi"

export interface Student {
  id: string
  name: string
  dateOfBirth: string
}
export const useGetStudent = (
  studentId: string
): [Student | undefined, boolean, () => void] => {
  return useApi<Student>(`/students/${studentId}`)
}
