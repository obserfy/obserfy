import { QueryKey, useQueryClient } from "react-query"

export const useQueryCache = <T>(key: QueryKey) => {
  const client = useQueryClient()

  return {
    getData: () => client.getQueryData<T>(key),
    setData: (data: T) => client.setQueryData(key, data),
    invalidate: () => client.invalidateQueries(key),
    refetchQueries: () => client.refetchQueries(key),
  }
}
