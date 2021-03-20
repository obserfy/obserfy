import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"

const useDeleteMaterial = (materialId: string) => {
  const deleteMaterial = deleteApi(`/curriculums/materials/${materialId}`)
  return useMutation(deleteMaterial)
}

export default useDeleteMaterial
