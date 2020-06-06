import useOldApiHook from "../useOldApiHook"

export interface Schools {
  id: string
  name: string
}
export const useGetSchools = (): [Schools[], boolean, () => void] => {
  const [schools, loading, setAsOutdated] = useOldApiHook<Schools[]>(
    "/user/schools"
  )
  return [schools ?? [], loading, setAsOutdated]
}
