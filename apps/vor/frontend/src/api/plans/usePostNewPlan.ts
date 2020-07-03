import { queryCache, useMutation } from "react-query"
import { navigate } from "gatsby"
import { ApiError, BASE_URL } from "../useApi"
import { Dayjs } from "../../dayjs"
import { getSchoolId } from "../../hooks/schoolIdState"

interface NewPlan {
  date: Dayjs
  title: string
  classId?: string
  description?: string
  areaId?: string
  students?: string[]
  repetition?: {
    type: number
    endDate: Dayjs
  }
}
const usePostNewPlan = () => {
  let date: string
  const postPlan = async (newPlan: NewPlan) => {
    const schoolId = getSchoolId()
    const result = await fetch(`${BASE_URL}/schools/${schoolId}/plans`, {
      method: "POST",
      body: JSON.stringify({
        title: newPlan.title,
        description: newPlan.description,
        fileIds: [],
        date: newPlan.date.startOf("day").toISOString(),
        repetition: newPlan.repetition,
        areaId: newPlan.areaId,
        classId: newPlan.classId,
        students: newPlan.students,
      }),
    })

    // Throw user to login when something gets 401
    if (result.status === 401) {
      await navigate("/login")
      return result
    }

    if (result.status !== 201) {
      const body: ApiError = await result.json()
      throw Error(body?.error?.message ?? "")
    }
    return result
  }

  return useMutation(postPlan, {
    onSuccess: () => queryCache.refetchQueries(["plans", getSchoolId(), date]),
  })
}

export default usePostNewPlan
