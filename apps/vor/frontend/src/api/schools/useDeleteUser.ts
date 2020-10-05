import { queryCache, useMutation } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteUser = (userId: string) => {
  const deleteUser = deleteApi(`/schools/${getSchoolId()}/users/${userId}`)
  return useMutation(deleteUser, {
    onSuccess: async () => {
      analytics.track("User Deleted")
      await queryCache.invalidateQueries(["school"])
    },
  })
}

export default useDeleteUser
