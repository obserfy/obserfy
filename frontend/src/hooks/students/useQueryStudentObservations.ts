import useApi from "../../api/useApi"

export interface Observation {
  id?: string
  studentId?: string
  shortDesc: string
  longDesc: string
  categoryId: string
  createdDate?: string
}
export const useQueryStudentObservations = (
  id: string
): [Observation[] | undefined, boolean, () => void] => {
  return useApi<Observation[]>(`/students/${id}/observations`)
}
