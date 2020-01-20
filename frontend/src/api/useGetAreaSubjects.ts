import useApi from "./useApi"

export interface Subject {
  id: string
  name: string
  order: string
}
export function useGetAreaSubjects(
  areaId: string
): [Subject[], boolean, () => void] {
  const [subjects, loading, setOutdated] = useApi<Subject[]>(
    `/curriculum/areas/${areaId}/subjects`
  )
  return [subjects ?? [], loading, setOutdated]
}
