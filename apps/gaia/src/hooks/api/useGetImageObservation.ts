import { useQuery } from "react-query"
import { GetChildObservationByImages } from "../../pages/api/image/[imageId]"
import { getApi } from "../../apiHelpers"

const useGetObservationsByImage = (imageId: string) => {
  const getObservationsByImage = getApi<GetChildObservationByImages>(`/image/${imageId}`)
  return useQuery(["observations", imageId], getObservationsByImage)
}

export default useGetObservationsByImage