import { useQuery } from "@tanstack/react-query"
import { GetMaterialProgressDetailResponse } from "../../pages/api/children/[childId]/progress/[materialId]"
import { getApi } from "./apiHelpers"

const useGetMaterialDetails = (childId: string, materialId: string) => {
  const getMaterialDetails = getApi<GetMaterialProgressDetailResponse>(
    `/children/${childId}/progress/${materialId}`
  )

  return useQuery(["material", childId, materialId], getMaterialDetails, {
    enabled: materialId !== "",
  })
}

export default useGetMaterialDetails
