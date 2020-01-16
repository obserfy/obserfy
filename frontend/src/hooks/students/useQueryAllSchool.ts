import useApi from "../../api/useApi"

export interface Schools {
  id: string
  name: string
}
export const useQueryAllSchools = (): [Schools[], boolean, () => void] => {
  const [schools, loading, setAsOutdated] = useApi<Schools[]>("/user/schools")
  return [schools ?? [], loading, setAsOutdated]
}
