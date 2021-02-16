import { useMutation } from "react-query"
import { deleteApi } from "../fetchApi"
import { useGetAreaSubjectsCache } from "../useGetAreaSubjects"

const useDeleteSubject = (areaId: string, subjectId: string) => {
  const subjectsCache = useGetAreaSubjectsCache(areaId)
  const deleteSubject = deleteApi(`/curriculums/subjects/${subjectId}`)

  return useMutation(deleteSubject, {
    onSuccess: async () => {
      await subjectsCache.refetchQueries()
      analytics.track("Subject Deleted")
    },
  })
}

export default useDeleteSubject
