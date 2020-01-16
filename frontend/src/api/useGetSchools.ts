import useApi from "./useApi"

export interface Schools {
  id: string
  name: string
}
export const useGetSchools = (): [Schools[], boolean, () => void] => {
  const [schools, loading, setAsOutdated] = useApi<Schools[]>("/user/schools")
  return [schools ?? [], loading, setAsOutdated]
}
