import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"

const usePatchSubject = (subjectId: string) => {
  const patchSubject = patchApi(`/curriculums/subjects/${subjectId}`)
  return useMutation(patchSubject)
}

export default usePatchSubject
