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
): [Observation[] | undefined, () => void, boolean] => {
  const [observations, setAsOutdated, loading] = useApi<Observation[]>(
    `/students/${id}/observations`
  )
  return [observations, setAsOutdated, loading]
}
