import useApi from "../useApi"

export interface Student {
  id: string
  name: string
}
export const useStudentNames = (): Student[] => {
  return useApi<Student[]>("/students") ?? []
}
