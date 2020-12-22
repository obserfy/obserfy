import { useMutation, useQueryClient } from "react-query"
import { getSchoolId } from "../../schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteUser = (userId: string) => {
  const queryCache = useQueryClient()
  const deleteUser = deleteApi(`/schools/${getSchoolId()}/users/${userId}`)
  return useMutation(deleteUser, {
    onSuccess: async () => {
      analytics.track("User Deleted")
      await queryCache.invalidateQueries(["school"])
    },
  })
}

export default useDeleteUser
