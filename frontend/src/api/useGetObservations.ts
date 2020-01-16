import useApi from "./useApi"

export interface Observation {
  id?: string
  studentId?: string
  shortDesc: string
  longDesc: string
  categoryId: string
  createdDate?: string
}
export const useGetObservations = (
  studentId: string
): [Observation[] | undefined, boolean, () => void] => {
  return useApi<Observation[]>(`/students/${studentId}/observations`)
}
