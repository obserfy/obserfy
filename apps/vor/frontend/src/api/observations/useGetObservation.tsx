import { useQuery } from "react-query"
import { getApi } from "../fetchApi"

interface Observation {
  id: string
}
const useGetObservation = (observationId: string) => {
  const getObservation = getApi<Observation>(`/observations/${observationId}`)
  return useQuery(["observation", observationId], getObservation)
}

export default useGetObservation
