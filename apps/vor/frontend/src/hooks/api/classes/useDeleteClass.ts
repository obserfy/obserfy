import { useMutation, useQueryClient } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteClass = (classId: string) => {
  const queryClient = useQueryClient()
  const deleteClass = deleteApi(`/classes/${classId}`)

  return useMutation(deleteClass, {
    onSuccess: async () => {
      analytics.track("Class Deleted")
      await queryClient.invalidateQueries(["classes", getSchoolId()])
    },
  })
}

export default useDeleteClass
