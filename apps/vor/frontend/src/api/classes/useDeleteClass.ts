import { queryCache, useMutation } from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { deleteApi } from "../fetchApi"

const useDeleteClass = (classId: string) => {
  const deleteClass = deleteApi(`/classes/${classId}`)

  return useMutation(deleteClass, {
    onSuccess: async () => {
      await queryCache.invalidateQueries(["classes", getSchoolId()])
    },
  })
}

export default useDeleteClass
