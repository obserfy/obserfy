import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import {
  getSchoolGuardiansCache,
  setSchoolGuardiansCache,
} from "./useGetSchoolGuardians"

const useDeleteGuardian = (guardianId: string) => {
  const deleteObservation = deleteApi(`/guardians/${guardianId}`)
  return useMutation(deleteObservation, {
    onSuccess: async () => {
      analytics.track("Guardians Deleted")
      const guardians = getSchoolGuardiansCache()
      setSchoolGuardiansCache(
        guardians?.filter(({ id }) => id !== guardianId) ?? []
      )
    },
  })
}

export default useDeleteGuardian
