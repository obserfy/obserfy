import { useMutation, useQueryClient } from "react-query"
import { track } from "../../../analytics"
import { patchApi } from "../fetchApi"
import { Dayjs } from "../../../dayjs"

interface UpdateStudentRequestBody {
  name?: string
  customId?: string
  dateOfBirth?: Dayjs
  dateOfEntry?: Dayjs
  gender?: number
  active?: boolean
  profileImageId?: string
  note?: string
}
export function usePatchStudentApi(id: string) {
  const queryCache = useQueryClient()
  const patchStudent = patchApi<UpdateStudentRequestBody>(`/students/${id}`)

  return useMutation(patchStudent, {
    onSuccess: async () => {
      track("Student Updated", { id })
      await Promise.all([
        queryCache.invalidateQueries(["student", id]),
        queryCache.invalidateQueries("students"),
      ])
    },
  })
}
