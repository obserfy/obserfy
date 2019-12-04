import useApi from "../useApi"

export interface Schools {
  id: string
  name: string
}
export const useQueryAllSchools = (): [Schools[], () => void] => {
  const [schools, setAsOutdated] = useApi<Schools[]>("/user/schools")
  return [schools ?? [], setAsOutdated]
}
