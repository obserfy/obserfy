import { useMutation } from "react-query"
import { patchApi } from "../fetchApi"
import { useGetSchoolCache } from "./useGetSchool"

interface PatchSchoolRequestBody {
  name: string
}
const usePatchSchool = (schoolId: string) => {
  const cache = useGetSchoolCache(schoolId)
  const patchSchool = patchApi<PatchSchoolRequestBody>(`/schools/${schoolId}`)

  return useMutation(patchSchool, {
    onSuccess: async () => {
      await cache.invalidate()
    },
  })
}

export default usePatchSchool
