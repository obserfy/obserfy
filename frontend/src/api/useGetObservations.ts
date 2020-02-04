import useOldApiHook from "./useOldApiHook"

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
  return useOldApiHook<Observation[]>(`/students/${studentId}/observations`)
}
