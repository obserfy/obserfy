import { useQuery } from "react-query"
import { getApi } from "./apiHelpers"
import { GetChildProgressResponse } from "../../pages/api/children/[childId]/progress"
import { Area } from "../../domain"

const useGetCurriculumProgress = (
  childId: string,
  onSuccess: (data: Area[]) => void = () => {}
) => {
  const getCurriculumProgress = getApi<GetChildProgressResponse>(
    `/children/${childId}/progress`
  )

  return useQuery(["child", childId, "progress"], getCurriculumProgress, {
    onSuccess: (data) => {
      onSuccess(data)
    },
  })
}

export default useGetCurriculumProgress
