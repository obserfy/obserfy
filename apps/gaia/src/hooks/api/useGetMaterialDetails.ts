import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"

const useGetMaterialDetails = (childId: string, materialId: string) => {
  const getMaterialDetails = getApi(
    `/children/${childId}/progress/${materialId}`
  )

  return useQuery(["material", childId, materialId], getMaterialDetails)
}

export default useGetMaterialDetails
