import useApi from "../useApi"

export interface Observation {
  id?: string
  studentId?: string
  shortDesc: string
  longDesc: string
  createdDate?: string
}
export const useQueryStudentObservations = (
  id: string
): [Observation[] | undefined, () => void] => {
  const [observations, setAsOutdated] = useApi<Observation[]>(
    `/students/${id}/observations`
  )
  return [observations, setAsOutdated]
}
