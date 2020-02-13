import useOldApiHook from "./useOldApiHook"

export interface Subject {
  id: string
  name: string
  order: number
}
export function useGetAreaSubjects(
  areaId: string
): [Subject[], boolean, () => void] {
  const [subjects, loading, setOutdated] = useOldApiHook<Subject[]>(
    `/curriculum/areas/${areaId}/subjects`
  )
  return [subjects ?? [], loading, setOutdated]
}
