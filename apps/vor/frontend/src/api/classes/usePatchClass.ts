import {
  MutateFunction,
  MutationResult,
  queryCache,
  useMutation,
} from "react-query"
import { getSchoolId } from "../../hooks/schoolIdState"
import { patchApi } from "../fetchApi"

interface Class {
  name: string
  startTime: Date
  endTime: Date
  weekdays: number[]
}
const usePatchClass = (
  classId: string
): [MutateFunction<Response, Class>, MutationResult<Response>] => {
  const patchClass = patchApi<Class>("/classes", classId)

  return useMutation<Response, Class>(patchClass, {
    onSuccess: async () => {
      await Promise.all([
        queryCache.refetchQueries(["class", classId]),
        queryCache.refetchQueries(["classes", getSchoolId()]),
      ])
    },
  })
}

export default usePatchClass
