import useOldApiHook from "./useOldApiHook"

export interface Student {
  id: string
  name: string
  dateOfBirth: string
}
export const useGetStudent = (
  studentId: string
): [Student | undefined, boolean, () => void] => {
  return useOldApiHook<Student>(`/students/${studentId}`)
}
