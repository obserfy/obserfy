import { useMutation } from "react-query"
import { track } from "../../../analytics"
import { deleteApi } from "../fetchApi"
import { useGetSchoolGuardiansCache } from "./useGetSchoolGuardians"

const useDeleteGuardian = (guardianId: string) => {
  const cache = useGetSchoolGuardiansCache()

  const deleteObservation = deleteApi(`/guardians/${guardianId}`)
  return useMutation(deleteObservation, {
    onSuccess: async () => {
      track("Guardians Deleted")
      const guardians = cache.getData() ?? []
      cache.setData(guardians.filter(({ id }) => id !== guardianId))
    },
  })
}

export default useDeleteGuardian
