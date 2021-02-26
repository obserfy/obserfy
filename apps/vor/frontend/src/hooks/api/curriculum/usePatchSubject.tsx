import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetAreaSubjectsCache } from "../useGetAreaSubjects"

const usePatchSubject = (subjectId: string, areaId: string) => {
  const cache = useGetAreaSubjectsCache(areaId)
  const patchSubject = patchApi(`/curriculums/subjects/${subjectId}`)
  return useMutation(patchSubject, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePatchSubject
